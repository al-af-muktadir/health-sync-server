import config from "../../../config";
import prisma from "../../../shared/Prisma";
import axios from "axios";
import APiError from "../../errors/ApiError";
import { StatusCodes } from "http-status-codes";
import { PaymentStatus } from "@prisma/client";
const initPayment = async (appointmentId: any) => {
  const paymentData = await prisma.payment.findFirstOrThrow({
    where: {
      appointmentId: appointmentId,
    },
    include: {
      appointment: {
        include: {
          patient: true,
        },
      },
    },
  });
  try {
    const data = {
      store_id: config.ssl.storeId,
      store_passwd: config.ssl.storePass,
      total_amount: paymentData.amount,
      currency: "BDT",
      tran_id: paymentData.transactionId, // use unique tran_id for each api call
      success_url: config.ssl.successUrl,
      fail_url: config.ssl.failedUrl,
      cancel_url: config.ssl.cancelUrl,
      ipn_url: "http://localhost:3030/ipn",
      shipping_method: "N/A",
      product_name: "Appointment",
      product_category: "Service",
      product_profile: "general",
      cus_name: paymentData.appointment.patient.name,
      cus_email: paymentData.appointment.patient.email,
      cus_add1: paymentData.appointment.patient.address,
      cus_add2: "N/A",
      cus_city: "Dhaka",
      cus_state: "Dhaka",
      cus_postcode: "1000",
      cus_country: "Bangladesh",
      cus_phone: paymentData.appointment.patient.contactNumber,
      cus_fax: "01711111111",
      ship_name: "Customer Name",
      ship_add1: "Dhaka",
      ship_add2: "Dhaka",
      ship_city: "Dhaka",
      ship_state: "Dhaka",
      ship_postcode: 1000,
      ship_country: "N/A",
    };
    const response = await axios({
      method: "POST",
      url: config.ssl.ssl_payment_api,
      data: data,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const gatewayUrl = response.data.GatewayPageURL;
    return {
      paymentUrl: gatewayUrl,
    };
  } catch (err) {
    throw new APiError(StatusCodes.BAD_REQUEST, "Payment Error Occured");
  }
};

const validatePayment = async (payload: any) => {
  console.log("Payment validation function called");
  if (!payload || !payload.status || !(payload.status === "VALID")) {
    return {
      message: "Invalid Payment",
    };
  }
  let validationResponse;
  try {
    validationResponse = await axios({
      method: "GET",
      url: `${config.ssl.ssl_validation_api}?val_id=${payload.val_id}&store_id=${config.ssl.storeId}&store_passwd=${config.ssl.storePass}&format=json`,
    });
    if (validationResponse.data.status !== "VALID") {
      return {
        message: "Payment Validation Failed",
      };
    }
  } catch (err) {
    throw new APiError(StatusCodes.BAD_REQUEST, "Payment Validation Error");
  }
  const result = await prisma.$transaction(async (tx) => {
    const paymentData = await tx.payment.update({
      where: {
        transactionId: payload.tran_id,
      },
      data: {
        status: PaymentStatus.PAID,
        paymentGatewayData: validationResponse.data,
      },
    });
    await tx.appointment.update({
      where: {
        id: paymentData.appointmentId,
      },
      data: {
        paymentStatus: PaymentStatus.PAID,
      },
    });
    return {
      message: "Payment Succussfully",
    };
  });
};
export const paymentService = {
  initPayment,
  validatePayment,
};

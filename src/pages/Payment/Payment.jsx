import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import IMAGES from "../../images";
import { useLocation, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import Loader from "../../components/Loader";
import axios from "../../axios";
const Payment = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleClick = () => {
    // navigate("/dashboard")
  };

  const location = useLocation();
  const { price } = location.state || {};

  useEffect(() => {
    if(price){
      localStorage.setItem("price", price)
    }
  },[])

  // let data = localStorage.getItem("wodProUserTempData");
  // if (data) {
  //     console.log("here")
  //     data = JSON.parse(data)
  //     console.log("json data is : ", data);
  //     getStripeClientScecret(data?.userObj?.price);

  const handleCardClick = () => {
    console.log("Card Payment");
    navigate("/stripe");
  };

  const [loading, setLoading] = useState(false);

  const completeSignup = async () => {
    try {
      console.log("in sign up")
      setLoading(true);
      let data = localStorage.getItem("wodProUserTempData");
      if (data) {
        data = JSON.parse(data);
        console.log("sign method is running");
        console.log("local storage data is : ", data);

        const db = getFirestore();
        const response = await createUserWithEmailAndPassword(
          auth,
          data.userObj.email,
          data.userObj.password
        );
        console.log(response.user);

        let firestoreUserObj = {
          userId: response.user.uid,
          email: data.userObj.email,
          firstName: data.userObj.firstName,
          gender: data.userObj.gender,
          birthDate: data.userObj.birthDate,
          lastName: data.userObj.lastName,
          address: data.userObj.address,
          boxNumber: data?.userObj?.boxNumber || 0,
          phoneNumber: data.userObj.phoneNumber,
          city: data.userObj.ciudad,
          province: data.userObj.provincia,
          categoryPrice: data.userObj.price,
          country: data.userObj.country,
          street: data.userObj.street,
          postalCode: data.userObj.postalCode,
          boxNumber: data.userObj.boxNumber,
          categoryName: data.userObj.categoryName,
          createdAt: new Date(Date.now()).toUTCString(),
          isPaid: true,
          isActive: true,
            platform:"web"
        };

        if (!data?.userObj?.teamFound && !data.userObj.individual) {
          let uuid = uuidv4();
          const teamRef = doc(db, "teams", uuid);
          let myteamobj = {
            ...data?.teamObj,
            teamCreatorId: response.user.uid,
            teamId: uuid,
            platform:"web"
          };
          const teamCreation = await setDoc(teamRef, myteamobj);
          console.log("team creation response is : ", teamCreation);
          firestoreUserObj = {
            ...firestoreUserObj,
            teamName: data.userObj.teamName,
            teammateEmails: data.userObj.teammateEmails,
            teamId: uuid,
            platform:"web"
          };
        }

        const docRef = doc(db, "users", response.user.uid);
        const result = await setDoc(docRef, firestoreUserObj);

        if(data.userObj.coupenFlag4){
          console.log("i coupe flag 4")
          const coupenRef = doc(db, "freeCoupons", data.userObj.coupen4);
        const coupenresult = await setDoc(coupenRef, {
          code: data.userObj.coupen4,
          isUsed: true,
          usedBy: response.user.uid
        });
        }

        else {if (data.userObj.coupenFlag) {
          const coupenref = collection(
            db,
            `coupons/${data?.userObj?.coupen}/users/`
          );
          await addDoc(coupenref, {
            timestamp: Date.now(),
            userId: response.user.uid,
          });
        }
        if (data.userObj.coupenFlag2) {
          const coupenref = collection(
            db,
            `coupons/${data?.userObj?.coupen2}/users/`
          );
          await addDoc(coupenref, {
            timestamp: Date.now(),
            userId: response.user.uid,
          });
        }
      }
        setLoading(false);
        let dataa = JSON.parse(localStorage.getItem("wodproEmailData"));
        // if (dataa) {
        //   console.log("email data is", dataa);

        //   // sendmaill(dataa.subject, dataa.text, dataa.emaillist);
        //   sendInvoice(dataa.subject, dataa.emaillist,  data.userObj.firstName, data.userObj.categoryName
            // , price, price)
          if (dataa && dataa.isTeam) {
            sendmaill(dataa.teamSubject, dataa.teamText, dataa.teamList);
          }
        // }
        localStorage.clear();
        alert("SignUp Successfull!");
        navigate("/signup");
      }
    } catch (error) {
      setLoading(false);
      
      if (error.message == "Firebase: Error (auth/email-already-in-use).") {
        console.log("user already exists in error in complete signup");
        // navigate("/signup");
        let dataa = JSON.parse(localStorage.getItem("wodproEmailData"));
        let data = localStorage.getItem("wodProUserTempData");
      // if (dataa) {
      //   console.log("email data is", dataa);
      //   // let cardnumber = 
      //   sendInvoice(dataa.subject, dataa.emaillist,  data.userObj.firstName, data.userObj.categoryName
      //     , totalPrice, paidPrice)

        // sendmaill(dataa.subject, dataa.text, dataa.emaillist);
        if (dataa && dataa.isTeam) {
          sendmaill(dataa.teamSubject, dataa.teamText, dataa.teamList);
        }
      // }

        localStorage.clear();
      } else {
        alert("An unexpected error occured");
        console.log("error while creating and saving user data");
        console.log("error is ", error);
      }
    }
  };

  const sendmaill = async (subject, text, emaillist) => {
    console.log("subject and text is", subject, text, emaillist);
    await axios
      .post("/user/sendEmail-nodemailer", {
        to: emaillist,
        subject: subject,
        text: text,
        metadata: " Un pasito más cerca.",
      })
      .then((res) => {
        console.log("response is", res.data);
      })
      .catch((err) => {
        console.log("err is", err);
      });
  };

  const sendInvoice = async (paymentId) => {
    let data = JSON.parse(localStorage.getItem("paymentKeys"))
    let user = JSON.parse(localStorage.getItem("wodProUserTempData"))
    let price = localStorage.getItem("price")
    console.log("price is ........", price)

    await axios
      .post("/user/sendInvoice", {
        to: user.userObj.email,
        subject: "Ya estás inscrito a la WOD PRO pero te falta algo…",
        name: user.userObj.firstName,
        category:user.userObj.categoryName,
        totalPrice: price,
        paidPrice: data.amount/100,
        customerId:data.customerId,
        paymentId,
        metadata: " Un pasito más cerca.",
      })
      .then((res) => {
        console.log("response is", res.data);
      })
      .catch((err) => {
        console.log("err is", err);
      });
  };

  // for the memeber who are already in a team and their payment is already done
  const signInWithoutPayment = async () => {
    try {
      setLoading(true);
      let data = localStorage.getItem("wodProUserTempData");
      if (data) {
        data = JSON.parse(data);
        console.log("sign method is running");
        console.log("local storage data is : ", data);

        const db = getFirestore();
        const response = await createUserWithEmailAndPassword(
          auth,
          data.userObj.email,
          data.userObj.password
        );
        console.log(response.user);

        let firestoreUserObj = {
          userId: response.user.uid,
          gender: response.user.gender,
          birthDate: response.user.gender,
          email: data.userObj.email,
          firstName: data.userObj.firstName,
          lastName: data.userObj.lastName,
          address: data.userObj.address,
          boxNumber: data?.userObj?.boxNumber || 0,
          phoneNumber: data.userObj.phoneNumber,
          city: data.userObj.ciudad,
          province: data.userObj.provincia,
          categoryPrice: data.userObj.price,
          country: data.userObj.country,
          street: data.userObj.street,
          postalCode: data.userObj.postalCode,
          boxNumber: data.userObj.boxNumber,
          categoryName: data.userObj.categoryName,
          createdAt: new Date(Date.now()).toUTCString(),
          isPaid: true,
          isActive: true,
          teamName: data.userObj.teamName,
          teamId: data.userObj.teamId,
          teammateEmails: data.userObj.teammateEmails,
        };

        const docRef = doc(db, "users", response.user.uid);
        const result = await setDoc(docRef, firestoreUserObj);

        setLoading(false);
        localStorage.clear();
        alert("SignUp Successfull!");
        navigate("/login");
      }
    } catch (error) {
      setLoading(false);
      if (error.message == "Firebase: Error (auth/email-already-in-use).") {
        console.log("user already exists in error in signup without paymet");
        localStorage.clear();
      } else {
        alert("An unexpected error occured");
        console.log("error while creating and saving user data");
        console.log("error is ", error);
      }
    }
  };

  useEffect(() => {
    let data = localStorage.getItem("wodProUserTempData");
    if (data) {
      data = JSON.parse(data);
      if (data.userObj.payment) {
        signInWithoutPayment();
      }
    }
   // Assuming `location.search` is the query string from the URL
const queryParams = new URLSearchParams(location.search);

// Retrieve the status and payment_intent from query parameters
const status = queryParams.get("redirect_status");
const paymentIntentId = queryParams.get("payment_intent");

// Check if status is "succeeded" and paymentIntentId is available
if (status === "succeeded" && paymentIntentId) {
  // Use the paymentIntentId to retrieve card details or perform other actions
  console.log("Payment Intent ID:", paymentIntentId);

  // Call your functions to handle the successful payment
  sendInvoice(paymentIntentId);
  completeSignup();
} else {
  // Handle cases where payment did not succeed or paymentIntentId is missing
  console.log("Payment status is not succeeded or paymentIntentId is missing.");
}

  }, []);

  // const retrieveCardDetails = async (paymentMethodId) => {
  //   let data = JSON.parse(localStorage.getItem("paymentKeys"));
  //   console.log("data is", data)
  //   try {
  //     const paymentMethodd = await stripe.paymentMethods.attach(
  //       // data.paymentId,
  //       "pm_1Psp4OFwZYAVAKRZT5REuCYQ",
  //       {
  //         customer: "cus_QkJUk8l02UUILo"
  //         // data.customerId,
  //       }
  //     )
  //     // const card = paymentMethod;
  //     console.log("card is", paymentMethodd);
  // } catch (err) {
  //     console.log("error is", err);
  // }
  

 
// };

  return (
    <>
      <div
        // className='bg-white h-screen'
        className="bg-cover h-screen"
        style={{
          backgroundImage: `url(${IMAGES.BackgroundImagee2})`,
          backgroundPosition: "center",
        }}
      >
        <img src={IMAGES.Logo} />
        <div className="absolute top-0 left-0 right-0 bottom-0 "></div>
        <div className="relative">
          {/* <NavBar activePage="Signup" /> */}
          <div
            className="flex items-center items-center justify-center md:pl-[60px]"
            style={{ height: "calc(100vh - 220px)" }}
          >
            <div className="flex flex-col gap-5 border-2 border-[#B6B5FF] rounded-xl pb-3 pt-6 px-6 bg-[#B6B5FF40] xl:w-[25%] lg:w-[33%] md:w-[44%] sm:w-[47%] w-[80%]">
              <div className="flex items-center justify-center">
                <p className="text-[#03045E] font-bold text-[18px]">
                  Detalles del pago
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-[#03045E] text-[16px] text-justify">
                  ¡Completa tu registro hoy! Paga {price}€ para activar tu
                  cuenta y disfrutar de acceso completo a nuestros servicios.
                </p>
              </div>
              {loading ? (
                <Loader />
              ) : (
                <div className="flex flex-col gap-2 pb-5">
                  {/* <div className='flex flex-row border-2 border-white rounded-md py-2 px-4 gap-3 cursor-pointer bg-[#B6B5FF]' onClick={handleClick}>
                                        <img src={IMAGES.Paypal} alt='Menu' className='h-6 w-6' />
                                        <p className='text-[#03045E]'>Continuar con PayPal</p>
                                    </div> */}
                  {/* <div className='flex flex-row border-2 border-white rounded-md py-2 px-4 gap-3 cursor-pointer bg-[#B6B5FF]' onClick={handleClick}>
                                        <img src={IMAGES.ApplePay} alt='Menu' className='h-6 w-6' />
                                        <p className='text-[#03045E]'>Continuar con Apple Pay</p>
                                    </div> */}
                  <div
                    className="flex flex-row border-2 border-white rounded-md py-2 px-4 gap-3 cursor-pointer bg-[#B6B5FF]"
                    onClick={handleCardClick}
                  >
                    <img src={IMAGES.Visa} alt="Menu" className="h-6 w-6" />
                    <p className="text-[#03045E]">Continuar con Credit/Debit</p>
                  </div>
                  {/* <div className='flex flex-row border-2 border-white rounded-md py-2 px-4 gap-3 cursor-pointer bg-[#B6B5FF]' onClick={handleClick}>
                                        <img src={IMAGES.AndroidPay} alt='Menu' className='h-6 w-6' />
                                        <p className='text-[#03045E]'>Continuar con Android Pay</p>
                                    </div> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;

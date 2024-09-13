import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import IMAGES from "../../images";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  getAuth,
  setPersistence,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getDoc,
  getFirestore,
  query,
  setDoc,
} from "firebase/firestore";
import Loader from "../../components/Loader";
import { v4 as uuidv4 } from "uuid";
import axios from "../../axios";
import CountriesProvinceState from "./CountriesProvinceState";

const Signup = () => {
  const auth = getAuth();

  const [category, setCategory] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [email1, setEmail1] = useState("");
  const [email2, setEmail2] = useState("");
  const [email3, setEmail3] = useState("");

  const [emaillistt, setEmaillistt] = useState("");
  const [teamName, setTeamName] = useState("");
  const [coupen, setCoupen] = useState("");
  const [coupen2, setCoupen2] = useState("");
  const [coupen3, setCoupen3] = useState(null);
  const [coupen4, setCoupen4] = useState('50%offWPLparejasintermedio2024');

  const [genero, setGenero] = useState("");
  const [shownGender, setshownGender] = useState(["Genero"]);
  const [allGender, setAllGender] = useState(["Genero"]);
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [provincia, setProvincia] = useState("");
  const [pais, setPais] = useState("");

  const [birthDate, setBirthDate] = useState("");
  const [address, setAddress] = useState("");
  const [boxName, setBoxName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [subject, setSubject] = useState("");
  const [text, setText] = useState("");

  const [cityFlag, setCityFlag] = useState(false);

  const [loading, setLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");

  const [teamId, setTeamId] = useState("");
  const [team, setTeam] = useState(null);

  const [privacypolicy, setPrivacypolicy] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        await axios
      .get("user/checkTeam/"+email1).then((res) => {
        console.log("fetched team is", res.data)
        setTeamId(res.data[0].teamId)
        setTeamName(res.data[0].teamName)
        setEmail(res.data[0].creatorEmail)
        if(res.data[0].teammateEmails[0] == email1){
          setEmail2(res.data[0].teammateEmails[1])
        setEmail3(res.data[0].teammateEmails[2])
        }
        else if(res.data[0].teammateEmails[1] == email1){
          setEmail2(res.data[0].teammateEmails[0])
        setEmail3(res.data[0].teammateEmails[2])
        }
        else if(res.data[0].teammateEmails[2] == email1){
          setEmail2(res.data[0].teammateEmails[0])
        setEmail3(res.data[0].teammateEmails[1])
        }
        //         // setEmail1(res.data[0].teammateEmails[0])
        // setEmail2(res.data[0].teammateEmails[1])
        // setEmail3(res.data[0].teammateEmails[2])
      }).catch((err)=> {
        console.log("err")
        setTeamId("")
      })
    
      } catch (err) {
        console.log("Error fetching teams:", err);
        setTeamId("")
      }
    };
    //

    if(teamId=="" && email1 != ""){
    fetchTeams();
    }
  }, [email,email1, email2, email]);

  useEffect(() => {
    localStorage.clear();
  }, []);

  const fetchTeams = async (email) => {
    try {
      await axios
    .get("user/checkTeam/"+email).then((res) => {
      return true
    }).catch((err)=> {
      console.log("err")
      return false
    })
  
    } catch (err) {
      console.log("Error fetching teams:", err);
    }
  };

  const fetchUsers = async (email) => {
    let exist = false
    try {
      await axios
    .get("user/checkUser/"+email).then((res) => {
      
        exist = true
        
  
    }).catch((err)=> {
      console.log("err")
    })
  
    } catch (err) {
      console.log("Error fetching teams:", err);
    }
    return exist
  };
  const createUser = async (price) => {
    console.log("in create user", email1);

    try {
      const db = getFirestore();

      // Check if the user already exists in Firestore
      const userRef = doc(db, "users", email1); // Use email1 directly as the document ID
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        alert("User already exists. Please log in.");
        return; // Exit the function to prevent creating a duplicate user
      }

      // Proceed with creating a new user with Firebase Authentication
      const response = await createUserWithEmailAndPassword(
        auth,
        email1,
        password
      ); // Use email1 directly here as well
      console.log("response is", response.user);

      // Prepare the Firestore user object
      let firestoreUserObj = {
        userId: response.user.uid,
        email: email1,
        firstName: firstName,
        gender: genero,
        birthDate,
        lastName,
        address,
        boxNumber: boxName || 0,
        phoneNumber: phoneNumber,
        city: ciudad.name,
        province: provincia.name,
        categoryPrice: price,
        country: pais.name,
        street: calle,
        postalCode: codigoPostal,
        boxNumber: boxName,
        categoryName: selectedCategory,
        createdAt: new Date(Date.now()).toUTCString(),
        isPaid: true,
        isActive: true,
      };

      // Save the user data to Firestore
      const docRef = doc(db, "users", response.user.uid);
      await setDoc(docRef, firestoreUserObj);
      alert("User registered successfully");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("An error occurred while registering the user.");
    }
  };

  // const categories = [
  //   { name: 'RX Individual Masculino', price: "120 €" },
  //   { name: "INTERMEDIO Individual Masculino", price: "120 €" },
  //   { name: "MASTERS +40 Masculino", price: "110 €" },
  //   { name: "MASTERS +50 Masculino", price: "110 €" },
  //   { name: "ESCALADO Individual Masculino", price: "100 €" },
  //   { name: "RX Individual Femenino", price: "120 €" },
  //   { name: "INTERMEDIO Individual Femenino", price: "110 €" },
  //   { name: "MASTERS +40 Femenino", price: "110 €" },
  //   { name: "MASTERS +50 Femenino", price: "110 €" },
  //   { name: "ESCALADO Individual Femenino", price: "100 €" },
  //   { name: "RX Parejas MM", price: "220 €" },
  //   { name: "INTERMEDIO Parejas MM", price: "200 €" },
  //   { name: "ESCALADO Parejas MM", price: "190 €" },
  //   { name: "RX Equipos MMMF", price: "400 €" },
  //   { name: "INTERMEDIO Equipos MMMF", price: "360 €" },
  //   { name: "ESCALADO Equipos MMMF", price: "360 €" },
  // ];

  const categories = [
    { name: "RX Individual - M", price: "129 €" },
    { name: "RX Individual - F", price: "129 €" }, //
    { name: "RX Parejas - MM", price: "249 €" }, //
    // { name: "RX Equipos - MMMF", price: "490 €" },
    { name: "Intermediate Individual - M", price: "129 €" },

    { name: "Intermediate Individual - F", price: "129 €" },
    { name: "Intermediate Parejas - MM", price: "249 €" },
    { name: "Intermediate Parejas - MF", price: "249 €" },
    { name: "Intermediate Equipos - MMMF", price: "490 €" },

    { name: "Scaled Individual - M", price: "129 €" },
    { name: "Scaled Individual - F", price: "129 €" },
    { name: "Scaled Parejas - MM", price: "249 €" },
    { name: "Scaled Parejas - MF", price: "249 €" },
    { name: "Scaled Equipos - MMMF", price: "490 €" },
    { name: "Masters +35 - Individual - M", price: "129 €" },
    { name: "Masters +35 - Individual - F", price: "129 €" },

    { name: "Masters +40 - Individual - M", price: "129 €" },
    { name: "Masters +40 - Individual - F", price: "129 €" }, //
    // { name: "Teens - Individual - M", price: "129 €" }, //
    // { name: "Teens - Individual - F", price: "129 €" },
  ];

  const coupensArray = [
    "Baby",
    "Saralicia",
    "Babybeast",
    "ElenaCarratala",
    "SalvaSalveta",
    "PacoBravo",
    "Fabi",
    "Aniol",
    "Sepius",
    "Bryanhernandez",
    "Cazalis",
    "Elia",
    "Paumt",
    "Terra",
    // "Early Bird",
    "Dami",
    "Romanfitness",
    "Carla10",
    "WPL10",
    "VELITES10"
  ];

  const discount100 = [
    "gK4Ucnc4EArLlnsWPL",
    "aKGRTGG5FPGwwyhWPL",
    "R49DTipz6Y4tKvDWPL",
    "BrowLeCsk0sGLkNWPL",
    "btzQcmJB93MSsr0WPL",
  ];

  // const couponn2 = 'Early Bird'

  const handleSelectChange = (event) => {
    setSelectedCategory(event.target.value);
    console.log(event.target.value);
    let genderss = event.target.value.split(" - ");
    genderss = genderss[genderss.length - 1];
    console.log("genders are", genderss);
    let gendersPresent = ["Genero"];
    setshownGender(updateGenderArray(genderss, gendersPresent));
  };

  function updateGenderArray(gender, genderArray) {
    if (gender.includes("M") && !genderArray.includes("Male")) {
      genderArray.push("Male");
    }
    if (gender.includes("F") && !genderArray.includes("Female")) {
      genderArray.push("Female");
    }

    return genderArray;
  }

  const handleInputChange = (setter) => (event) => {
    setter(event.target.value);
  };
  const navigate = useNavigate();

  const handleSignUp = async () => {
    navigate("/login");
  };

  const handleAge = async () => {
    if (birthDate == '') {
      alert("Please select birth date");
      return false;
    }
  
    let birthYear = birthDate.split('-')[0];
    const currentYear = new Date().getFullYear();
    let age = currentYear - birthYear;
  
    let minAge = 18;
    let maxAge = null;
    let isValid = true
  
    if (selectedCategory == 'Masters +35 - Individual - M' || selectedCategory == 'Masters +35 - Individual - F') {
      minAge = 35;
      maxAge = 40;
    } else if (selectedCategory == 'Masters +40 - Individual - M' || selectedCategory == 'Masters +40 - Individual - F') {
      minAge = 40;
    } else if (selectedCategory == 'Teens - Individual - M' || selectedCategory == 'Teens - Individual - F') {
      minAge = 16;
      maxAge = 17;
    }
  
    if (age < minAge) {
      alert(`Your age is less than ${minAge}`);
      isValid = false
    } else if (age > maxAge && maxAge != null) {
      alert(`Your age is greater than ${maxAge}`);
      isValid = false
    } 
      return isValid;
    
  }

  const handleJoinNow = async () => {
    setLoading(true);
    try {
      if(privacypolicy == false){
        alert("Select privacy policy")
        setLoading(false)
        return
      }
      console.log("in try");
      const db = getFirestore();

      let userExist = await fetchUsers(email)

      if(teamId=="" && userExist == true){
        alert("This user already exists")
        setLoading(false)
        return
      }
    

      const teamdocref = collection(db, "teams");
      const tq = query(teamdocref);
      const tresult = await getDocs(tq)
        .then()
        .catch((err) => console.log("test team", err));
      let allTeams = [];

      console.log("getting all the teams");
      tresult.forEach((doc) => {
        allTeams.push(doc.data());
      });

      console.log("all teams are");

      let allMailSatisfied = false;
      let userFound = false;
      let emailFound = false;
      let otherTeamMember = false;
      let teamObj = {};

        if (userExist == true) {
          userFound = true;
        }

        let isValidAge = await handleAge();
        console.log("is valid is", isValidAge);
      if(isValidAge == false){
        setLoading(false)
        return
      }


      if (email || email1 || email2 || email3) {
        if (
          (email1 != "" &&
            email1 == email2 &&
            email == email1 &&
            email == email2) ||
          (email1 != "" &&
            email1 == email3 &&
            email == email1 &&
            email == email3) ||
          (email2 != "" &&
            email3 != "" &&
            email2 == email3 &&
            email == email2 &&
            email == email3)
        ) {
          alert("Teammate email cannot be same!");
          setLoading(false);
          return;
        }

        allTeams.map((item) => {
          // console.log("creator mail is : ", item.teammateEmails);
          if (
            item.teammateEmails.includes(email) ||
            item.creatorEmail == email
          ) {
            console.log("email already in team found");
            emailFound = true;
            teamObj = item;
          }
        });

        if (!emailFound) {
          allTeams.map((item) => {
            if (
              email1 &&
              (item.teammateEmails.includes(email1) ||
                item.creatorEmail == email1)
            ) {
              console.log("Member already in other team found", item.teamId);
              otherTeamMember = true;
            }
            if (
              email2 &&
              (item.teammateEmails.includes(email2) ||
                item.creatorEmail == email2)
            ) {
              console.log("Member already in other team found", item.teamId);
              otherTeamMember = true;
            }
            if (
              email2 &&
              (item.teammateEmails.includes(email2) ||
                item.creatorEmail == email2)
            ) {
              console.log("Member already in other team found", item.teamId);
              otherTeamMember = true;
            }
          });
        }

        if (emailFound) {
          console.log("team obj is : ", teamObj);
          if (email1 == teamObj.creatorEmail) {
            if (
              teamObj.teammateEmails.includes(email2) &&
              teamObj.teammateEmails.includes(email3)
            ) {
              console.log("all the email satisfied");
              alert("all the email satisfied");
              allMailSatisfied = true;
            }
          }

          if (email2 == teamObj.creatorEmail) {
            if (
              teamObj.teammateEmails.includes(email1) &&
              teamObj.teammateEmails.includes(email3)
            ) {
              console.log("all the email satisfied");
              alert("all the email satisfied");
              allMailSatisfied = true;
            }
          }

          if (email3 == teamObj.creatorEmail) {
            if (
              teamObj.teammateEmails.includes(email1) &&
              teamObj.teammateEmails.includes(email2)
            ) {
              console.log("all the email satisfied");
              alert("all the email satisfied");
              allMailSatisfied = true;
            }
          }
        }

        if (teamId == "" && emailFound && !allMailSatisfied) {

          alert("Please enter all the email of teammeates correctly");
          setLoading(false);
          return;
        }
      }

      // if (emailFound && allMailSatisfied) {
      if (password == confirmPassword) {
        console.log("password matched");
        if (password.length >= 6) {
          setLoading(true);

          let coupenFlag2,
            coupenFlag3,coupenFlag4,
            coupenFlag = false;
          let coupeen3 = null;

          if (coupen || coupen2) {
            let coupen1,
              coupenn2 = false;
            let coupen1Value, coupen2Value;
            coupensArray.map((item) => {
              if (item == coupen) {
                coupen1 = true;
                coupen1Value = item;
              }
              if (item == coupen2 && item != coupen) {
                coupenn2 = true;
                coupen2Value = item;
              }
            });

            // if(coupen1Value != "Early Bird" || coupen2Value != 'Early Bird'){
            //   coupenn2 = false
            // }

            discount100.map(async(item) => {
              if (item == coupen || item == coupen2) {
                
                coupenFlag3 = true;
                setCoupen3(item);
                coupeen3 = item;
              }
            });

            if ( coupen == '50%offWPLparejasintermedio2024' || coupen2 == "50%offWPLparejasintermedio2024") {
              const coupenRef = doc(db, "freeCoupons", '50%offWPLparejasintermedio2024');
              const coupenDoc = await getDoc(coupenRef);
              let isUsed = coupenDoc._document.data.value.mapValue.fields.isUsed.booleanValue;
              if(isUsed == false){
              coupenFlag4 = true;
              setCoupen4('50%offWPLparejasintermedio2024');
              }
            }

            if(coupenFlag4 == true){

            }

            if(coupenFlag3 == true){
              const coupenRef = doc(db, "freeCoupons", coupeen3);
              const coupenDoc = await getDoc(coupenRef);
              let isUsed = coupenDoc._document.data.value.mapValue.fields.isUsed.booleanValue;
              if(isUsed == true){
                  setCoupen(false)
                  coupenFlag3= false
              }
            }

            // console.log("coupen 2 is...............................", couponn2, coupen2)
            if (coupenFlag3 == true) {
              alert("You are selected for 100% discount");
            }else if (coupenFlag4 == true) {
              alert("You are selected for 50% discount");
            }
             else if (coupen1 && coupenn2) {
              alert("You are selected for 20% discount");
              coupenFlag = true;
              coupenFlag2 = true;
            } else if (coupenn2 || coupen1) {
              if (coupen1) {
                coupenFlag = true;
              } else {
                coupenFlag2 = true;
              }
              alert("You are selected for 10% discount");
            }
          }

          let price = 0;

          if (selectedCategory == "RX Individual - M") price = 129;
          if (selectedCategory == "RX Individual - F") price = 129;
          if (selectedCategory == "RX Parejas - MM") price = 249;
          if (selectedCategory == "RX Equipos - MMMF") price = 490;
          if (selectedCategory == "Intermediate Individual - M") price = 129;
          if (selectedCategory == "Intermediate Individual - F") price = 129;
          if (selectedCategory == "Intermediate Parejas - MM") price = 249;
          if (selectedCategory == "Intermediate Parejas - MF") price = 249;
          if (selectedCategory == "Intermediate Equipos - MMMF") price = 490;
          if (selectedCategory == "Scaled Individual - M") price = 129;
          if (selectedCategory == "Scaled Individual - F") price = 129;
          if (selectedCategory == "Scaled Parejas - MM") price = 249;
          if (selectedCategory == "Scaled Parejas - MF") price = 249;
          if (selectedCategory == "Scaled Equipos - MMMF") price = 490;
          if (selectedCategory == "Masters +35 - Individual - M") price = 129;
          if (selectedCategory == "Masters +35 - Individual - F") price = 129;
          if (selectedCategory == "Masters +40 - Individual - M") price = 129;
          if (selectedCategory == "Masters +40 - Individual - F") price = 129;
          if (selectedCategory == "Teens - Individual - M") price = 129;
          if (selectedCategory == "Teens - Individual - F") price = 129;

          console.log("price is", price);

          // if (selectedCategory == "RX Individual Masculino") price = 129;
          // if (selectedCategory == "INTERMEDIO Individual Masculino") price = 129;
          // if (selectedCategory == "MASTERS +40 Masculino") price = 110;
          // if (selectedCategory == "MASTERS +50 Masculino") price = 110;
          // if (selectedCategory == "ESCALADO Individual Masculino") price = 100;
          // if (selectedCategory == "RX Individual Femenino") price = 129;
          // if (selectedCategory == "INTERMEDIO Individual Femenino") price = 129;
          // if (selectedCategory == "MASTERS +40 Femenino") price = 110;
          // if (selectedCategory == "MASTERS +50 Femenino") price = 110;
          // if (selectedCategory == "ESCALADO Individual Femenino") price = 110;
          // if (selectedCategory == "RX Parejas MM") price = 249;
          // if (selectedCategory == "INTERMEDIO Parejas MM") price = 249;
          // if (selectedCategory == "ESCALADO Parejas MM") price = 190;
          // if (selectedCategory == "RX Equipos MMMF") price = 490;
          // if (selectedCategory == "INTERMEDIO Equipos MMMF") price = 490;
          // if (selectedCategory == "ESCALADO Equipos MMMF") price = 360;

          price = price * 100;

          let teammateEmails = [];
          email1 && teammateEmails.push(email1);
          email2 && teammateEmails.push(email2);
          email3 && teammateEmails.push(email3);

          let teamGenders = [];
          let captianGender = genero;
          let allGender = selectedCategory.split(" - ");
          allGender = allGender[allGender.length - 1];
          const allGenderArray = allGender.split("");
          let count = 0;
          console.log("all gender array is ", allGenderArray);

          if (allGenderArray.length > 1) {
            allGenderArray.map((val, ind) => {
              if (count == 0) {
                if (
                  (genero == "Masculino" && val == "M") ||
                  (genero == "Femenino" && val == "F")
                ) {
                  count++;
                } else if (val == "M") {
                  teamGenders.push("Masculino");
                } else if (val == "F") {
                  teamGenders.push("Femenino");
                }
              } else if (val == "M") {
                teamGenders.push("Masculino");
              } else if (val == "F") {
                teamGenders.push("Femenino");
              }
            });
          }
          // email1 && teamGenders.push("Masculino");
          // email2 && teamGenders.push("Masculino");
          // email3 && teamGenders.push("Femenino");
          console.log("team genders are", teamGenders);

          if (!emailFound || teamId != "")  {
            teamObj = {
              creatorEmail: email,
              teamCategory: selectedCategory,
              teamCreatorId: "userid", // get this after creating the user in authentication
              teamName,
              teammateEmails,
              teammateGenders: teamGenders,
              teamId: "generate uuid",
            };
          }
          console.log("birth date is", birthDate, "genero is", genero);

          let userObj = {
            email,
            firstName,
            lastName,
            address,
            password,
            phoneNumber,
            ciudad: ciudad.name,
            provincia: provincia.name,
            teamName,
            teammateEmails,
            teamId: teamObj.teamId,
            coupenFlag,
            coupenFlag2,
            coupenFlag4,
            coupen,
            coupen2: coupen2,
            coupen3,
            coupen4,
            birthDate,
            gender: genero,
            price: price,
            payment: emailFound,
            teamFound: emailFound,
            individual: false,
            country: pais.name,
            street: calle,
            postalCode: codigoPostal,
            boxNumber: boxName,
            categoryName: selectedCategory,
          };

          if (!email1 && !email2 && !email3 && email) {
            userObj = {
              email,
              firstName,
              password,
              lastName,
              payment: false,
              address,
              country: pais.name,
              boxNumber: boxName,
              phoneNumber,
              birthDate,
              gender: genero,
              ciudad: ciudad.name,
              provincia: provincia.name,
              coupenFlag,
              coupenFlag2,
              coupenFlag4,
              coupen,
              coupen2: coupen2,
              coupen3,
              coupen4,
              price,
              teamFound: false,
              individual: true,
              street: calle,
              postalCode: codigoPostal,
              categoryName: selectedCategory,
              teamName: "",
              teammateEmails: [],
              teamId: "",
            };
            teamObj = {};
          }

          // user id will be generate that will be used when the user is saved in firestore and team

          // const response = await createUserWithEmailAndPassword(auth, email, password);
          // console.log(response.user);

          // const db = getFirestore();

          // const docRef = doc(db, "test_users", response.user.uid);

          // const resutl = await setDoc(docRef, userObj);

          // let uuid = uuidv4();

          // const teamRef = doc(db, "test_Teams", uuid);

          // const teamCreation = await setDoc(teamRef, teamObj);
          // console.log("team cration response is : ", teamCreation);

          // if(coupenFlag){
          //    const coupenref = collection(db, "coupons/Baby/users/");
          //     await addDoc(coupenref, { coupen, userId: response.user.uid });
          // }

          let data = { teamObj, userObj };

          console.log("data is : ", data);

          setLoading(false);

          localStorage.setItem("wodProUserTempData", JSON.stringify(data));

          setTimeout(() => {
            setLoading(false);
            sendEmail();
            let pricee = price / 100;
            if (coupenFlag4) {
              pricee = price / 100 - (price / 100) * 0.5;
              // pricee *= 100
            }
            else if (coupenFlag && coupenFlag2) {
              pricee = price / 100 - (price / 100) * 0.2;
              // pricee *= 100
            } else if (coupenFlag == true || coupenFlag2 == true) {
              pricee = price / 100 - (price / 100) * 0.1;
              // pricee *= 100
            }

            if (coupenFlag3 == true) {
              completeSignup(data, coupeen3);
            } else if (teamId == "") {
              navigate("/payment", { state: { price: pricee } });
            } else if(teamId != ""){
              console.log("other team member is", otherTeamMember, "team id is", teamId);
              createUser(price);
              // alert(
              //   "One of your entered emails is already in other team! Enter a different mail."
              // );
              // setLoading(false);
              return null;
            }
          }, 1000);
        } else {
          alert("Password must be at least 6 characters");
        }
      } else {
        alert("password does not match");
      }
      // }
      //  else {
      //     alert("Creator cannot be in two teams a creator");
      // }
    } catch (error) {
      console.log("in catch");
      console.log("error msg is : ", error.message);
      if (error.message == "Firebase: Error (auth/email-already-in-use).") {
        alert("Email already in use");
      } else {
        console.log("error while creating the user is ; ", error);
      }
    }
    setLoading(false);
  };

  const completeSignup = async (data, coupen3) => {
    try {
      setLoading(true);
      // let data = localStorage.getItem("wodProUserTempData");
      if (data) {
        console.log("signup data is : ", data);

        const db = getFirestore();
        const response = await createUserWithEmailAndPassword(
          auth,
          data.userObj.email,
          data.userObj.password
        );
        console.log("auth response is ", response.user);

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
          platform: "web",
        };

        if (!data?.userObj?.teamFound && !data.userObj.individual) {
          let uuid = uuidv4();
          const teamRef = doc(db, "teams", uuid);
          let myteamobj = {
            ...data?.teamObj,
            teamCreatorId: response.user.uid,
            teamId: uuid,
            platform: "web",
          };
          const teamCreation = await setDoc(teamRef, myteamobj);
          console.log("team cration response is : ", teamCreation);
          firestoreUserObj = {
            ...firestoreUserObj,
            teamName: data.userObj.teamName,
            teammateEmails: data.userObj.teammateEmails,
            teamId: uuid,
            platform: "web",
          };
        }

        const docRef = doc(db, "users", response.user.uid);
        const result = await setDoc(docRef, firestoreUserObj);

        const coupenRef = doc(db, "freeCoupons", coupen3);
        const coupenresult = await setDoc(coupenRef, {
          code: coupen3,
          isUsed: true,
          usedBy: response.user.uid
        });


        setLoading(false);
        let dataa = JSON.parse(localStorage.getItem("wodproEmailData"));
        if (dataa) {
          console.log("email data is", dataa);

          sendmail(dataa.subject, dataa.text, dataa.emaillist);
          if (dataa.isTeam) {
            sendmail(dataa.teamSubject, dataa.teamText, dataa.teamList);
          }
        }
        localStorage.clear();
        alert("SignUp Successfully with 100 % discount!");
        // navigate("/signup");
      }
    } catch (error) {
      setLoading(false);

      if (error.message == "Firebase: Error (auth/email-already-in-use).") {
        console.log("user already exists in error in complete signup");
        alert("user already exists and error in complete signup");
        navigate("/signup");

        localStorage.clear();
      } else {
        alert("An unexpected error occured");
        console.log("error while creating and saving user data");
        console.log("error is ", error);
      }
    }
  };

  // api integration
  const sendEmail = async () => {
    console.log("in send email");

    let category = selectedCategory.split(" - ");
    category = category[category.length - 1];
    let length = category.length;

    let sub, textt, maillist, subteam, textTeam, mailListTeam;
    let isTeam = false;

    if (length == 4) {
      isTeam = true;
      maillist = email;
      mailListTeam = `${email1},${email2},${email3}`;
      setEmaillistt(maillist);

      let name2 = email1.split("@")[0];
      let name3 = email2.split("@")[0];
      let name4 = email3.split("@")[0];

      sub = " Ya estáis inscritos a la WOD PRO pero os falta algo…";
      subteam = " Ya estáis registrados en la WOD PRO pero os falta algo…";
      textt = `
<div> 
<p> <b>Hola Equipo!!</b></p>
<p>¡Ya sois parte del movimiento WOD PRO: la 1ª Liga Online de Cross Training! </p>
<p>Tenemos muchas ganas de veros compitiendo.</p>
<p>Para empezar, descargad nuestra app y acceded a vuestro perfil con el mismo email que habéis usado para el pago.</p>
<p><b><a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'>
[Descargar APP]
</a></b></p>
<p>¡Nos vemos dentro!  🚀</p>
<p>Equipo de WOD PRO League</p>
<p><b>Ps: </b> Si tienes iPhone, descarga la app en el siguiente
<a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'> link </a>
 y accede con tu usuario. Si tienes Android, en breves estará disponible y te avisaremos en cuanto esté en Play Store</p>
</div>`;

      textTeam = `
<div> 
<p> <b>Hola ${name2} y ${name3} y ${name4}</b></p>
<p>¡Ya sois parte del movimiento WOD PRO: la 1ª Liga Online de Cross Training! </p>
<p>Tenemos muchas ganas de veros compitiendo 😏</p>
<p>Tu capitán/a ya tiene acceso a su cuenta, ahora te toca a ti inscribirte.</p>
<p>Para empezar sigue los siguientes pasos:</p>
<p>1. Descarga la app</p>
<p>2. Haz click en “Inscribirse”.</p>
<p>3. Selecciona la categoría en la que tu capitán te ha inscrito.</p>
<p>4. Ingresa el correo electrónico de tu capitán/a y los datos de tu equipo se registrarán automáticamente.</p>
<p>5. Completa el registro rellenando los datos que te pedimos.</p>


<p>Y disfruta compitiendo en la mejor liga de cross training online del mundo 🔥</p>
<p><b><a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'>
[Descargar APP]
</a></b></p>
<p>¡Nos vemos dentro!  🚀</p>
<p>Equipo de WOD PRO League</p>
<p><b>Ps: </b> Si tienes iPhone, descarga la app en el siguiente
<a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'> link </a>
 y accede con tu usuario. Si tienes Android, en breves estará disponible y te avisaremos en cuanto esté en Play Store</p>
</div>`;
      setSubject(sub);

      setText(textt);
    } else if (length == 2) {
      isTeam = true;
      mailListTeam = email1;
      maillist = `${email}`;
      setEmaillistt(maillist);

      let name2 = email1.split("@")[0];
      sub = "Ya estáis inscritos en la WOD PRO pero os falta algo…";
      subteam = "Ya estáis registrados en la WOD PRO pero os falta algo…";
      textt = `<div>
     <p> <b> Hola ${firstName}, </b> </p>
     <p>¡Ya sois parte del movimiento WOD PRO: la 1ª Liga Online de Cross Training! </p>
     <p>Tenemos muchas ganas de veros compitiendo.</p>
     <p>Para empezar, descargad nuestra app y acceded a vuestro perfil con el mismo email que habéis usado para el pago.</p>
     <p>(Cada uno podrá entrar )</p>
    <p><b><a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'>
[Descargar APP]
</a></b></p>
<p>¡Nos vemos dentro!  🚀</p>
<p>Equipo de WOD PRO League</p>
<p><b>Ps: </b> Si tienes iPhone, descarga la app en el siguiente
<a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'> link </a>
 y accede con tu usuario. Si tienes Android, en breves estará disponible y te avisaremos en cuanto esté en Play Store</p>
      </div>`;
      textTeam = `<div>
     <p> <b> Hola ${name2}, </b> </p>
     <p>¡Ya sois parte del movimiento WOD PRO: la 1ª Liga Online de Cross Training! </p>
     <p>Tenemos muchas ganas de veros compitiendo.</p>
     <p>Tu capitán/a ya tiene acceso a su cuenta, ahora te toca a ti inscribirte.</p>
     <p>Para empezar sigue los siguientes pasos:</p>
<p>1. Descarga la app</p>
<p>2. Haz click en “Inscribirse”.</p>
<p>3. Selecciona la categoría en la que tu capitán te ha inscrito.</p>
<p>4. Ingresa el correo electrónico de tu capitán/a y los datos de tu equipo se registrarán automáticamente.</p>
<p>5. Completa el registro rellenando los datos que te pedimos.</p>
<p>Y disfruta compitiendo en la mejor liga de cross training online del mundo 🔥</p>


    <p><b><a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'>
[Descargar APP]
</a></b></p>
<p>¡Nos vemos dentro!  🚀</p>
<p>Equipo de WOD PRO League</p>
<p><b>Ps: </b> Si tienes iPhone, descarga la app en el siguiente
<a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'> link </a>
 y accede con tu usuario. Si tienes Android, en breves estará disponible y te avisaremos en cuanto esté en Play Store</p>
      </div>`;

      setSubject(sub);
      setText(textt);
    } else if (length == 1) {
      maillist = email;
      setEmaillistt(maillist);
      sub = "Ya estás inscrito a la WOD PRO pero te falta algo…";
      textt = `
        <div>
      <p><b> ¡Hola ${firstName}! </b> </p>
      <p>¡Gracias por inscribirte a la 1ª Liga Online de Cross Training! </p>
      <p>Tenemos muchas ganas de verte compitiendo.</p>
      <p>Para empezar, descarga la app y accede a tu perfil con el mismo email que utilizaste para el pago.</p>
       <p><b><a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'>
[Descargar APP]
</a></b></p>
<p>¡Nos vemos dentro!  🚀</p>
<p>Equipo de WOD PRO League</p>
<p><b>Ps: </b> Si tienes iPhone, descarga la app en el siguiente
<a href='https://apps.apple.com/app/wod-pro-league/id6538719686/'> link </a>
 y accede con tu usuario. Si tienes Android, en breves estará disponible y te avisaremos en cuanto esté en Play Store</p>
</div>`;

      setSubject(sub);
      setText(textt);
    }
    console.log("subject and text is", sub, textt, maillist);
    let emailData = {
      subject: sub,
      text: textt,
      emaillist: maillist,

      teamSubject: subteam,
      teamText: textTeam,
      teamList: mailListTeam,

      isTeam: isTeam,
    };
    localStorage.setItem(
      "wodproEmailData",
      JSON.stringify({
        subject: sub,
        text: textt,
        emaillist: maillist,

        teamSubject: subteam,
        teamText: textTeam,
        teamList: mailListTeam,

        isTeam: isTeam,
      })
    );
    // sendmail(sub, textt, maillist)
  };
  // useEffect(() => {
  const sendmail = async (subject, text, emaillist) => {
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
        setSubject("");
        setText("");
      })
      .catch((err) => {
        console.log("err is", err);
      });
  };
  //   if (subject && text) {
  //     sendmail();
  //   }
  // }, [subject, text]);

  return (
    <>
      <div className="min-h-screen flex-col bg-white flex justify-center flex-1 ">
        <p className="py-5 self-center font-bold text-3xl">
          ¡BIENVENIDO A WOD PRO LEAGUE!
        </p>
        <div className="flex-1 justify-center flex">
          <div className="flex items-center flex-1 justify-center md:pl-[60px]">
            <div className="flex flex-col gap-1 border-2 border-black rounded-xl pb-3 pt-6 px-6  xl:w-[23%] lg:w-[28%] md:w-[36%] sm:w-[45%]">
              <div className="flex flex-col gap-2 text-black">
                <select
                  value={selectedCategory}
                  onChange={handleSelectChange}
                  className="px-4 py-2  rounded border outline-none border-black text-sm customdropdown"
                >
                  <option value="">Categoria</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category.name}>
                      {category.name} - {category.price}
                    </option>
                  ))}
                </select>

                {/* replaced */}
                <input
                  type="email"
                  placeholder="Email del capitán o persona haciendo el registro​"
                  className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                  value={email}
                  onChange={handleInputChange(setEmail)}
                />

                {/* {selectedCategory == "ESCALADO Equipos MMMF" ?
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Email de tu compañero/a​"
                                            className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                                            value={email1}
                                            onChange={handleInputChange(setEmail1)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Email de tu compañero/a​"
                                            className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                                            value={email2}
                                            onChange={handleInputChange(setEmail2)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Email de tu compañero/a​"
                                            className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                                            value={email3}
                                            onChange={handleInputChange(setEmail3)}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Nombre del equipo"
                                            className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                                            value={teamName}
                                            onChange={handleInputChange(setTeamName)}
                                        />
                                    </>
                                    : <></>} */}

                <input
                  type="password"
                  placeholder="Contraseña"
                  className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                  value={password}
                  onChange={handleInputChange(setPassword)}
                />
                <input
                  type="password"
                  placeholder="Confirmar contraseña"
                  className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                  value={confirmPassword}
                  onChange={handleInputChange(setConfirmPassword)}
                />

                <input
                  type="text"
                  placeholder="Nombre"
                  className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                  value={firstName}
                  onChange={handleInputChange(setFirstName)}
                />
                <input
                  type="text"
                  placeholder="Apellidos"
                  className="px-4 py-2 border border-black rounded bg-transparent text-sm"
                  value={lastName}
                  onChange={handleInputChange(setLastName)}
                />
                <select
                  id="gender"
                  value={genero}
                  onChange={handleInputChange(setGenero)}
                  defaultValue={"Gender"}
                  className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                >
                  {shownGender?.map((val, ind) => {
                    return (
                      <>
                        {val == "Genero" && (
                          <option className="text-black" value="">
                            Genero
                          </option>
                        )}
                        {val == "Male" && (
                          <option className="text-black" value="Masculino">
                            Másculino
                          </option>
                        )}
                        {val == "Female" && (
                          <option className="text-black" value="Femenino">
                            Femenino
                          </option>
                        )}
                      </>
                    );
                  })}
                </select>
                <input
                  type="date"
                  placeholder="Fecha de Nacimiento"
                  className="px-4 py-2 border border-black rounded bg-transparent  text-sm"
                  value={birthDate}
                  onChange={handleInputChange(setBirthDate)}
                />

                <input
                  type="text"
                  placeholder="Calle"
                  className="px-4 py-2 border border-black rounded bg-transparent  text-sm"
                  value={calle}
                  onChange={handleInputChange(setCalle)}
                />
                <input
                  type="text"
                  placeholder="Número"
                  className="px-4 py-2 border border-black rounded bg-transparent  text-sm"
                  value={numero}
                  onChange={handleInputChange(setNumero)}
                />
                <input
                  type="text"
                  placeholder="Código postal"
                  className="px-4 py-2 border border-black rounded bg-transparent text-sm"
                  value={codigoPostal}
                  onChange={handleInputChange(setCodigoPostal)}
                />

                {/* <select
                  value={provincia}
                  onChange={(e) => setProvincia(e.target.value)}
                  className="px-4 py-2  rounded  text-sm customdropdown border border-black outline-none"
                >
                  <option value="">Provincia</option>
                  {provinces.map((p, index) => (
                    <option key={index} value={JSON.stringify(p)}>
                      {p.nm}
                    </option>
                  ))}
                </select>

                <select
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="px-4 py-2  rounded outline-none border border-black text-sm customdropdown"
                >
                  <option value="">Ciudad</option>
                  {cities.map((p, index) => {
                    {
                       }

                    if (
                      provincia &&
                      JSON.stringify(p.id).substring(1, 3) ==
                        JSON.parse(provincia).id.toString()
                    ) {
                      return (
                        <option key={index} value={JSON.stringify(p)}>
                          {p.nm}
                        </option>
                      );
                    }
                  })}
                </select>

                <input
                  type="text"
                  placeholder="Pais"
                  className="px-4 py-2 border border-black rounded bg-transparent  text-sm"
                  value={pais}
                  onChange={handleInputChange(setPais)}
                /> */}

                <CountriesProvinceState pais={pais} setPais={setPais} provincia={provincia} setProvincia={setProvincia}
                ciudad={ciudad} setCiudad={setCiudad} />

                {/* <input
                  type="text"
                  placeholder="Dirección"
                  className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                  value={address}
                  onChange={handleInputChange(setAddress)}
                /> */}
                <input
                  type="text"
                  placeholder="Nombre del box"
                  className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                  value={boxName}
                  onChange={handleInputChange(setBoxName)}
                />
                <input
                  type="tel"
                  placeholder="Número de teléfono"
                  className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                  value={phoneNumber}
                  onChange={handleInputChange(setPhoneNumber)}
                />
                {/* replaced */}
                {selectedCategory == "RX Parejas - MM" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del equipo"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={teamName}
                      onChange={handleInputChange(setTeamName)}
                    />
                    <input
                      type="text"
                      placeholder="Email de tu compañero/a​"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={email1}
                      onChange={handleInputChange(setEmail1)}
                    />
                  </>
                ) : (
                  <></>
                )}

                {selectedCategory == "Scaled Parejas - MF" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del equipo"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={teamName}
                      onChange={handleInputChange(setTeamName)}
                    />
                    <input
                      type="text"
                      placeholder="Email de tu compañero/a​"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={email1}
                      onChange={handleInputChange(setEmail1)}
                    />
                  </>
                ) : (
                  <></>
                )}

                {selectedCategory == "Intermediate Parejas - MF" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del equipo"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={teamName}
                      onChange={handleInputChange(setTeamName)}
                    />
                    <input
                      type="text"
                      placeholder="Email de tu compañero/a​"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={email1}
                      onChange={handleInputChange(setEmail1)}
                    />
                  </>
                ) : (
                  <></>
                )}

                {selectedCategory == "Intermediate Parejas - MM" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del equipo"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={teamName}
                      onChange={handleInputChange(setTeamName)}
                    />
                    <input
                      type="text"
                      placeholder="Email de tu compañero/a​"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={email1}
                      onChange={handleInputChange(setEmail1)}
                    />
                  </>
                ) : (
                  <></>
                )}

                {selectedCategory == "Scaled Parejas - MM" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del equipo"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={teamName}
                      onChange={handleInputChange(setTeamName)}
                    />
                    <input
                      type="text"
                      placeholder="Email de tu compañero/a​"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={email1}
                      onChange={handleInputChange(setEmail1)}
                    />
                  </>
                ) : (
                  <></>
                )}

                {selectedCategory == "Scaled Equipos - MMMF" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del equipo"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={teamName}
                      onChange={handleInputChange(setTeamName)}
                    />

                    <input
                      type="text"
                      placeholder="Email de tu compañero/a​"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={email1}
                      onChange={handleInputChange(setEmail1)}
                    />
                   
                        <input
                          type="text"
                          placeholder="Email de tu compañero/a​"
                          className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                          value={email2}
                          onChange={handleInputChange(setEmail2)}
                        />
                        <input
                          type="text"
                          placeholder="Email de tu compañero/a​"
                          className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                          value={email3}
                          onChange={handleInputChange(setEmail3)}
                        />
                      
                  </>
                ) : (
                  <></>
                )}

                {selectedCategory == "RX Equipos - MMMF" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del equipo"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={teamName}
                      onChange={handleInputChange(setTeamName)}
                    />
                    <input
                      type="text"
                      placeholder="Email de tu compañero/a​"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={email1}
                      onChange={handleInputChange(setEmail1)}
                    />
                    
                        <input
                          type="text"
                          placeholder="Email de tu compañero/a​"
                          className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                          value={email2}
                          onChange={handleInputChange(setEmail2)}
                        />
                        <input
                          type="text"
                          placeholder="Email de tu compañero/a​"
                          className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                          value={email3}
                          onChange={handleInputChange(setEmail3)}
                        />
                      
                  </>
                ) : (
                  <></>
                )}

                {selectedCategory == "Intermediate Equipos - MMMF" ? (
                  <>
                    <input
                      type="text"
                      placeholder="Nombre del equipo"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={teamName}
                      onChange={handleInputChange(setTeamName)}
                    />
                    <input
                      type="text"
                      placeholder="Email de tu compañero/a​"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={email1}
                      onChange={handleInputChange(setEmail1)}
                    />
                        <input
                          type="text"
                          placeholder="Email de tu compañero/a​"
                          className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                          value={email2}
                          onChange={handleInputChange(setEmail2)}
                        />
                        <input
                          type="text"
                          placeholder="Email de tu compañero/a​"
                          className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                          value={email3}
                          onChange={handleInputChange(setEmail3)}
                        />
                      
                  </>
                ) : (
                  <></>
                )}

               
                {teamId == "" && (
                  <>
                    <input
                      type="text"
                      placeholder="Código descuento"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={coupen}
                      onChange={handleInputChange(setCoupen)}
                    />
                   {/* <input
                      type="text"
                      placeholder="Código descuento"
                      className="px-4 py-2 border border-black rounded bg-transparent text-black text-sm"
                      value={coupen2}
                      onChange={handleInputChange(setCoupen2)}
                    />
                    */}
                  </>
                )}
              </div>
              {/* <div className="flex gap-2 items-center"> */}
                <label className="flex items-center text-sm text-black mt-2">
                  <input
                  className="mr-2"
                    type="checkbox"
                    checked={privacypolicy}
                    onChange={() => {setPrivacypolicy(prev => !prev)}}
                  />
                 {/* <p className="text-sm text-black mt-4"> */}
             <a href="https://drive.google.com/file/d/1ry5OextZam82pNmseYTJEE1Gc6mPfDwt/view?usp=sharing">   
              He leido y aceptado la Politica de Privacidad
              </a> 
                {/* </p> */}
                </label>
               
                
              {/* </div> */}

              <div className="mt-5 flex flex-col gap-2">
                {loading ? (
                  <div className="flex justify-center">
                    {" "}
                    <Loader />
                  </div>
                ) : (
                  <Button
                    text={"Join Now"}
                    bgColor={"#B6B5FF"}
                    borderColor={"#B6B5FF"}
                    textColor={"#1A101A"}
                    handleClick={handleJoinNow}
                  />
                )}
                {/* <div className="flex items-center justify-center gap-1">
                  <p className="text-black text-sm">¿Ya tienes una cuenta? </p>
                  <p
                    onClick={handleSignUp}
                    className=" border-b text-black text-sm cursor-pointer"
                  >
                    {loading ? "loading" : "Accesso"}
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;

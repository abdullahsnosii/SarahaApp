// PART 1
// answer Q1 
// let number = "123"
// number = Number(number)
// console.log(typeof (number))
// console.log(number + 7);


// answer Q2
// function check(value) {
//     if (!value) {
//         return "Invalid"
//      } else {
//             return value
//         }
//     }
// console.log(check(0));





// answer Q3
// for (let i = 1; i < 11; i++) {
//     if (i % 2 == 0) {
//         continue;
//     }
//     console.log(i);
// };



// answer Q4
// const data =[10,15,19,18,20,30,70,80]
// const result =data.filter((ele,index)=>{
//     return ele % 2==0
// }
// )
// console.log(result);





// answer Q5
// let x=[1,2,3]
// let y=[4,5,6]
// let merged =[...x,...y]
// console.log(merged);





// answer Q6
// let dayNumber = 2
//  switch (dayNumber) {
//     case 1:
//         console.log("Sunday");
//         break;
//     case 2:
//         console.log("Monday");
//         break;
//     case 3:
//         console.log("Tuesday");
//         break;
//     case 4:
//         console.log("Wednesday");
//         break;
//     case 5:
//         console.log("Thursday");
//         break;
//     case 6:
//         console.log("Friday");
//         break;
//     case 7:
//         console.log("Saturday");
//         break;
// }




// answer Q7
// const data = ["a", "ab", "abc", "Abcd"]
// const result = data.map((ele, index) => {
//     return ele.length
// })
// console.log(result);





// answer Q8
// function check(number) {
//     if (number % 3 == 0 && number % 5 == 0) {
//         return "Divisible by both";
//     } else {
//         return "notDivisible by both";

//     }
// }
// console.log(check(15))



// answer Q9
// const square = (number) => {
//     return number ** 2
// }
// console.log(square(5));



// answer Q10
// function destructures(person) {
//     const name = person.name
//     const age = person.age
//     const gender = person.gender
//     return name + " is " + age + " years old " + "and " + gender
// }
// console.log(
//  destructures({
//     name: "abdullah",
//     age: 21,
//     gender: "male"
// }))

// another solution to Q10
// function destructures(person) {
//     const { name, age, gender } = person
//     return ` ${name} is ${age} years old and ${gender} `
// }
// console.log(
//     destructures({
//         name: "abdullah",
//         age: 21,
//         gender: "male"
//     }))


// answer Q11 
// function sum(...numbers) {
//     let total = 0
//     for (let i = 0; i < numbers.length; i++) {
//         total = total + numbers[i]
//     }
//     return total
// }
// console.log(sum(1, 2, 3, 4, 5, 6));


// answer Q12
// function delay() {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve("success")
//         }, 3000);
//     }
//     )
// }
// delay().then((message) => console.log(message))





// answer Q13
// function findTheLargest(arr) {
//     let number = arr[0]
//     for (let i = 0; i < arr.length; i++) {
//         if (arr[i] > number) {
//             number = arr[i]

//         };

//     }
//     return number
// }
// console.log(findTheLargest([1, 2, 4, 10, 6, 11, 13, 5]));





// answer Q14
// function getkey(user) {
//     return Object.keys(user);
// }
// console.log(
//     getkey({
//         name: "abdullah",
//         age: 21,
//         gender: "male"

//     }))


// answer Q15
// function SplitSentence(sentence) {
//     return sentence.split(" ")
// }
// console.log(SplitSentence("The quick brown fox"));


// PART 2
// answer Q1 
//  Foreach=> بتلف علي arr +بترجع (value,index,array) + بتبقا ماشيه async +مينفعش استخدم break عشان كلهم بيرنوا فل نفس الوقت
// ex
// let data = [10, 20, 30, 40]
// data.forEach((ele, index, array) => {
//     console.log({ ele, index, array })
// });
// forof =>بتلف علي arr +بترجع (ele) +بتبقا ماشيه sync + اقدر استخدم break عادي
// ex
// for (const ele of data) {
//     console.log(ele)
//     if (ele == 10) break;
// }
// كمان اقدر اطلع index
// for (const [index, ele] of data.entries()) {
//     console.log({ index, ele })

// }







// answer Q2
// hoisting => رفع diclearation ل اول سطر +with(function , var)
// ex
// console.log(x); //هنا var اترفعت ل var x; 
// var x = 25
// console.log(x);

//ex 2
// print()
// function print() {
//     console.log("hello");
// }

//  Temporal Dead Zone => بيحصل hoisting +  لاكن مش بيعمل access قبل ما اوصل ل سطر الي فيه let or const
// ex
// console.log(y); =>هيطلع error(Cannot access 'y' before initialization)
// let y=10
// console.log(y);




//answer Q3
// == compare value only
// ex
//console.log(5=="5");
// === compare value and datatype
// ex
// console.log(5==="5");





//answer Q4
// try-catch => بيسمحلك تجربي كود ممكن يحصله خطأ (try)، ولو حصل error، تمسكيه في catch بدل ما البرنامج كله يقف (crash)
// مهم جدًا في async عشان لو حصل مشكلة زي فشل fetch أو timeout، تقدري تتعاملي معاها من غير ما الكود يوقف فجأة
// ex 
// try {
//     let result = 10 / 0; // مش error فعليًا في JS، ده Infinity
//     console.log(result);

//     let x = notDefinedVariable; // ده هيسبب error فعلي
//     console.log(x);
// } catch (error) {
//     console.log("حصل خطأ:", error.message);
// }

// // ex - مثال async مع Promise
// async function getData() {
//     try {
//         let response = await fetch("https://invalid-url-xyz.com");
//         let data = await response.json();
//         console.log(data);
//     } catch (error) {
//         console.log("فشل الطلب:", error.message);
//     }
// }

// getData();





//answer Q5
// type conversion => تحويل ال  type 
// ex
// let x=30
// x = String(x)
// console.log(typeof x);

// type coercion =>  الاكراه  بشوف الاولويه وحوله  ه
//ex
// console.log(5 + "5");
// console.log(5 - "5");
// console.log(5 * "5");
// console.log(5 / "5");


//  # finish the task
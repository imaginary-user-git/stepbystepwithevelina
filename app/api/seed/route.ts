export const dynamic = "force-dynamic"
import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { CourseModel } from "@/lib/models/Course"
import { UserModel } from "@/lib/models/User"
import { hashPassword } from "@/lib/auth"
import { successResponse } from "@/lib/api/apiUtils"
import { NextResponse } from "next/server"

const courses = [
  {
    title: "Anglų kalba pradedantiesiems: Pirmieji žingsniai",
    description: "Pradėkite savo anglų kalbos kelionę nuo pagrindų! Šis kursas skirtas tiems, kurie nori išmokti anglų kalbos nuo nulio. Mokysimės kasdienių frazių, pagrindinio žodyno, paprastos gramatikos ir tarties. Pamokos sukurtos taip, kad mokymasis būtų paprastas, aiškus ir pritaikytas realioms situacijoms – apsipirkimas, susipažinimas, kelionės ir kasdienybė.",
    shortDescription: "Pradėkite mokytis anglų kalbos nuo nulio su aiškiomis ir praktiškomis pamokomis.",
    category: "english",
    difficulty: "beginner" as const,
    estimatedDuration: 40,
    rating: 4.9,
    totalRatings: 215,
    tags: ["pradedantieji", "bazinė-gramatika", "žodynas", "kasdienės-frazės", "tartis"],
    thumbnail: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop",
    isPublished: true,
    publishedAt: new Date("2024-09-01"),
    lessons: [
      {
        title: "Pasisveikinimai ir prisistatymas",
        type: "text" as const,
        content: { text: "Šioje pamokoje išmoksite pagrindinius pasisveikinimo būdus anglų kalba: Hello, Hi, Good morning, Good afternoon, Good evening. Taip pat mokysimės kaip prisistatyti: My name is..., I am from..., Nice to meet you." },
        order: 1,
        isPublished: true,
      },
      {
        title: "Skaičiai ir spalvos",
        type: "text" as const,
        content: { text: "Mokykitės skaičių nuo 1 iki 100 ir pagrindinių spalvų: red, blue, green, yellow, black, white, orange, purple, pink, brown." },
        order: 2,
        isPublished: true,
      },
      {
        title: "Patikrinkite savo žinias: Pagrindai",
        type: "quiz" as const,
        content: {
          questions: [
            { question: "Kaip angliškai pasakyti 'Laba diena'?", options: ["Good morning", "Good afternoon", "Good evening", "Good night"], correctAnswer: 1, explanation: "'Good afternoon' reiškia 'Laba diena' (po pietų)", points: 1 },
            { question: "Kokia spalva yra 'blue'?", options: ["Raudona", "Žalia", "Mėlyna", "Geltona"], correctAnswer: 2, explanation: "'Blue' reiškia mėlyną spalvą", points: 1 },
          ]
        },
        order: 3,
        isPublished: true,
      }
    ]
  },
  {
    title: "Kasdienė anglų kalba: Pokalbiai ir situacijos",
    description: "Mokykitės kalbėti angliškai realiose situacijose – parduotuvėje, kavinėje, darbe, pas gydytoją, keliaudami. Kiekviena pamoka paremta praktiniais dialogais ir pavyzdžiais, kuriuos galėsite iškart pritaikyti gyvenime. Kursas skirtas tiems, kurie jau turi bazines anglų kalbos žinias ir nori pralaužti kalbėjimo barjerą.",
    shortDescription: "Praktiniai pokalbiai kasdienėms situacijoms – nuo parduotuvės iki kelionių.",
    category: "english",
    difficulty: "intermediate" as const,
    estimatedDuration: 55,
    rating: 4.8,
    totalRatings: 178,
    tags: ["pokalbiai", "kasdienė-kalba", "situacijos", "kalbėjimas", "pasitikėjimas"],
    thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    isPublished: true,
    publishedAt: new Date("2024-09-15"),
    lessons: [
      {
        title: "Kavinėje ir restorane",
        type: "text" as const,
        content: { text: "Išmokite užsisakyti maistą ir gėrimus angliškai: Can I have...?, I would like..., The bill please. Dialogo pavyzdžiai ir naudingos frazės." },
        order: 1,
        isPublished: true,
      },
      {
        title: "Apsipirkimas ir kainų klausinėjimas",
        type: "text" as const,
        content: { text: "Mokykitės frazių apsipirkimui: How much is this?, Can I try this on?, Do you have this in a different size/color?" },
        order: 2,
        isPublished: true,
      },
      {
        title: "Kelionės ir oro uoste",
        type: "text" as const,
        content: { text: "Svarbiausios frazės keliautojams: Where is the gate?, I have a reservation., Could you help me find...?" },
        order: 3,
        isPublished: true,
      },
    ]
  },
  {
    title: "Anglų kalbos gramatika: Aiškiai ir paprastai",
    description: "Gramatika neturi būti nuobodi! Šiame kurse išmoksite svarbiausias anglų kalbos gramatikos taisykles – laikus (Present, Past, Future), artikelius, prielinksnius ir sakinių struktūrą. Visa tai paaiškinta lietuviškai, su daugybe pavyzdžių ir praktinių užduočių. Idealus kursas tiems, kurie nori sustiprinti gramatikos pagrindus.",
    shortDescription: "Svarbiausios gramatikos taisyklės, paaiškintos aiškiai ir paprastai lietuvių kalba.",
    category: "english",
    difficulty: "intermediate" as const,
    estimatedDuration: 65,
    rating: 4.7,
    totalRatings: 142,
    tags: ["gramatika", "laikai", "artikeliai", "prielinksniai", "taisyklės"],
    thumbnail: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
    isPublished: true,
    publishedAt: new Date("2024-10-01"),
    lessons: [
      {
        title: "Present Simple ir Present Continuous",
        type: "text" as const,
        content: { text: "Present Simple naudojame kalbėdami apie įpročius ir faktus: I work every day. Present Continuous – apie veiksmus, vykstančius dabar: I am working now." },
        order: 1,
        isPublished: true,
      },
      {
        title: "Past Simple: Pasakojame apie praeitį",
        type: "text" as const,
        content: { text: "Past Simple naudojame kalbėdami apie praeityje pasibaigusius veiksmus: I visited Lithuania last summer. I studied English for 3 years." },
        order: 2,
        isPublished: true,
      },
      {
        title: "Gramatikos testas",
        type: "quiz" as const,
        content: {
          questions: [
            { question: "Pasirinkite teisingą formą: She ___ to school every day.", options: ["go", "goes", "going", "gone"], correctAnswer: 1, explanation: "Trečias asmuo vienaskaita (she) reikalauja 'goes'", points: 1 },
            { question: "Pasirinkite teisingą laiką: I ___ dinner right now.", options: ["cook", "cooked", "am cooking", "was cooking"], correctAnswer: 2, explanation: "Present Continuous naudojamas veiksmui, vykstančiam dabar", points: 1 },
          ]
        },
        order: 3,
        isPublished: true,
      }
    ]
  },
  {
    title: "Verslo anglų kalba: Profesionaliam bendravimui",
    description: "Kursas skirtas profesionalams, kurie nori užtikrintai bendrauti anglų kalba darbo aplinkoje. Mokysimės rašyti profesionalius laiškus, vesti susitikimus, pristatyti projektus ir derėtis angliškai. Kursas apima verslo žodyną, formalią kalbą ir tarptautinio bendravimo etiketą.",
    shortDescription: "Profesionalus anglų kalbos kursas verslui – laiškai, susitikimai, pristatymai.",
    category: "english",
    difficulty: "advanced" as const,
    estimatedDuration: 50,
    rating: 4.8,
    totalRatings: 96,
    tags: ["verslas", "profesionalu", "laiškai", "susitikimai", "pristatymai"],
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
    isPublished: true,
    publishedAt: new Date("2024-10-15"),
    lessons: [
      {
        title: "Profesionalūs el. laiškai",
        type: "text" as const,
        content: { text: "Išmokite rašyti profesionalius el. laiškus angliškai. Struktūra: Subject line, Greeting (Dear Mr./Ms.), Body, Closing (Best regards, Kind regards)." },
        order: 1,
        isPublished: true,
      },
      {
        title: "Susitikimų vedimas angliškai",
        type: "text" as const,
        content: { text: "Naudingos frazės susitikimams: Let's get started, The purpose of this meeting is..., Moving on to the next point..., To summarize..." },
        order: 2,
        isPublished: true,
      },
    ]
  },
  {
    title: "Anglų kalbos tartis: Kalbėk aiškiai ir užtikrintai",
    description: "Tobulinkite savo anglų kalbos tartį! Šis kursas padės jums išmokti taisyklingai tarti anglų kalbos garsus, kurie lietuviams dažniausiai sukelia sunkumų – th, w, v, r garsai, ilgieji ir trumpieji balsiai. Kiekviena pamoka turi garso pavyzdžių ir pratimų.",
    shortDescription: "Tobulinkite anglų kalbos tartį su praktiniais garso pratimais.",
    category: "english",
    difficulty: "beginner" as const,
    estimatedDuration: 30,
    rating: 4.9,
    totalRatings: 203,
    tags: ["tartis", "garsai", "kalbėjimas", "klausymas", "akcentas"],
    thumbnail: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=600&h=400&fit=crop",
    isPublished: true,
    publishedAt: new Date("2024-11-01"),
    lessons: [
      {
        title: "TH garsas: 'think' vs 'this'",
        type: "text" as const,
        content: { text: "Anglų kalboje yra du TH garsai: /θ/ (think, thank, three) ir /ð/ (this, that, the). Lietuvių kalboje šių garsų nėra, todėl juos reikia mokytis specialiai." },
        order: 1,
        isPublished: true,
      },
      {
        title: "W ir V garsai",
        type: "text" as const,
        content: { text: "Anglų kalboje W ir V yra skirtingi garsai: W (water, want, week) – lūpos suapvalintos. V (very, voice, visit) – apatinė lūpa liečia viršutinius dantis." },
        order: 2,
        isPublished: true,
      },
    ]
  },
  {
    title: "Pasiruošimas IELTS egzaminui",
    description: "Išsamus kursas pasiruošti IELTS egzaminui. Apima visas keturias dalis: Listening, Reading, Writing ir Speaking. Kiekviena pamoka turi praktinių užduočių, strategijų ir patarimų, kaip gauti aukštesnį balą. Kursas lietuvių kalba, kad būtų lengviau suprasti sudėtingas temas.",
    shortDescription: "Pasiruoškite IELTS egzaminui su strategijomis ir praktinėmis užduotimis.",
    category: "english",
    difficulty: "advanced" as const,
    estimatedDuration: 80,
    rating: 4.6,
    totalRatings: 87,
    tags: ["IELTS", "egzaminas", "pasiruošimas", "akademinė-kalba", "strategijos"],
    thumbnail: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&h=400&fit=crop",
    isPublished: true,
    publishedAt: new Date("2024-11-15"),
    lessons: [
      {
        title: "IELTS struktūra ir vertinimas",
        type: "text" as const,
        content: { text: "IELTS egzaminas susideda iš 4 dalių: Listening (30 min), Reading (60 min), Writing (60 min), Speaking (11-14 min). Kiekviena dalis vertinama nuo 0 iki 9 balų." },
        order: 1,
        isPublished: true,
      },
      {
        title: "Writing Task 1: Grafiko aprašymas",
        type: "text" as const,
        content: { text: "Writing Task 1 reikia aprašyti grafiką, lentelę arba diagramą. Naudingos frazės: The chart shows..., There was a significant increase..., In comparison..." },
        order: 2,
        isPublished: true,
      },
    ]
  },
]

export async function POST(request: NextRequest) {
  try {
    await connectDB()

    // 1. Create Admin Account
    const adminPassword = await hashPassword("admin123456")
    const admin = await UserModel.findOneAndUpdate(
      { email: "admin@stepbystep.com" },
      {
        username: "superadmin",
        email: "admin@stepbystep.com",
        password: adminPassword,
        role: "admin",
        firstName: "Super",
        lastName: "Admin",
        isActive: true,
      },
      { upsert: true, new: true }
    )

    // 2. Create Teacher Account (Evelina)
    const teacherPassword = await hashPassword("teacher123456")
    const teacher = await UserModel.findOneAndUpdate(
      { email: "evelina@stepbystep.com" },
      {
        username: "evelina_teacher",
        email: "evelina@stepbystep.com",
        password: teacherPassword,
        role: "teacher",
        firstName: "Evelina",
        lastName: "Language",
        isActive: true,
      },
      { upsert: true, new: true }
    )

    // Clear existing courses
    await CourseModel.deleteMany({})

    // Create courses with the teacher's ID
    const createdCourses = []
    for (const courseData of courses) {
      const course = new CourseModel({
        ...courseData,
        teacherId: teacher._id,
        teacherName: `${teacher.firstName || ''} ${teacher.lastName || ''}`.trim() || teacher.username,
        enrolledStudents: [],
      })
      await course.save()
      createdCourses.push({ id: course._id, title: course.title })
    }

    return successResponse({
      message: "Seed successful",
      admin: { email: admin.email, role: admin.role },
      teacher: { email: teacher.email, role: teacher.role },
      coursesCreated: createdCourses.length
    })
  } catch (error: any) {
    console.error("Seed error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"
import { type NextRequest } from "next/server"
import { connectDB } from "@/lib/mongodb"
import { authenticateRequest } from "@/lib/middleware/security"
import { ProgressService } from "@/lib/services/progressService"
import { CourseModel } from "@/lib/models/Course"
import { withErrorHandling, successResponse } from "@/lib/api/apiUtils"
import { ApiErrors } from "@/lib/middleware/security"
import { quizSubmissionSchema } from "@/lib/validation/schemas"

async function submitQuiz(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: courseId } = await params
  const user = authenticateRequest(request)

  if (user.role !== "student") {
    throw ApiErrors.FORBIDDEN("Only students can submit quiz answers")
  }

  const body = await request.json()
  const quizData = quizSubmissionSchema.parse(body)

  await connectDB()

  // Verify the course exists and user is enrolled
  const course = await CourseModel.findById(courseId)
  if (!course) {
    throw ApiErrors.NOT_FOUND("Course not found")
  }

  if (!course.enrolledStudents.includes(user.userId as any)) {
    throw ApiErrors.FORBIDDEN("You are not enrolled in this course")
  }

  // Find the lesson
  const lesson = course.lessons.find((l: any) => l._id.toString() === quizData.lessonId)
  if (!lesson || lesson.type !== "quiz") {
    throw ApiErrors.NOT_FOUND("Quiz lesson not found")
  }

  if (!lesson.content.questions || lesson.content.questions.length === 0) {
    throw ApiErrors.NOT_FOUND("No questions found in this quiz")
  }

  // Calculate score
  let correctAnswers = 0
  let totalPoints = 0
  const results = []

  for (let i = 0; i < lesson.content.questions.length; i++) {
    const question = lesson.content.questions[i]
    const userAnswer = quizData.answers[i]
    const isCorrect = userAnswer === question.correctAnswer

    if (isCorrect) {
      correctAnswers++
    }

    totalPoints += question.points || 1
    results.push({
      questionIndex: i,
      question: question.question,
      userAnswer,
      correctAnswer: question.correctAnswer,
      isCorrect,
      explanation: question.explanation,
      points: isCorrect ? (question.points || 1) : 0,
    })
  }

  const score = Math.round((correctAnswers / lesson.content.questions.length) * 100)

  // Update progress
  await ProgressService.updateLessonProgress(
    user.userId,
    courseId,
    quizData.lessonId,
    {
      completed: true,
      quizScore: score,
      timeSpent: quizData.timeSpent || 0,
    }
  )

  return successResponse({
    message: "Quiz submitted successfully",
    score,
    correctAnswers,
    totalQuestions: lesson.content.questions.length,
    results,
    passed: score >= 70, // 70% passing grade
  })
}

export const POST = withErrorHandling(submitQuiz)

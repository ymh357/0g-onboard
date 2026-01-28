"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react";

interface Question {
  id: string;
  type: "single" | "multiple" | "true-false";
  prompt: string;
  options: string[];
  answerIndex: number | number[];
  explanation: string;
}

interface QuizProps {
  questions: Question[];
  title: string;
}

export function QuizComponent({ questions, title }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const question = questions[currentQuestion];
  const isCorrect = Array.isArray(question.answerIndex)
    ? selectedAnswers.sort().join(",") === question.answerIndex.sort().join(",")
    : selectedAnswers[0] === question.answerIndex;

  const handleAnswer = (index: number) => {
    if (question.type === "multiple") {
      setSelectedAnswers((prev) =>
        prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
      );
    } else {
      setSelectedAnswers([index]);
    }
  };

  const handleSubmit = () => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswers([]);
      setShowResult(false);
    }
  };

  return (
    <Card className="my-8">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          问题 {currentQuestion + 1} / {questions.length}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-lg font-medium mb-4">{question.prompt}</p>
          <div className="space-y-2">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswers.includes(index);
              const isAnswer = Array.isArray(question.answerIndex)
                ? question.answerIndex.includes(index)
                : question.answerIndex === index;

              return (
                <button
                  key={index}
                  onClick={() => !showResult && handleAnswer(index)}
                  disabled={showResult}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showResult
                      ? isAnswer
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : isSelected && !isAnswer
                        ? "border-red-500 bg-red-50 dark:bg-red-950"
                        : "border-border"
                      : isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {isAnswer && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                        {isSelected && !isAnswer && <XCircle className="h-5 w-5 text-red-500" />}
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {showResult && (
          <div className="p-4 rounded-lg bg-muted">
            <p className="font-semibold mb-2">
              {isCorrect ? "✓ 回答正确！" : "✗ 回答错误"}
            </p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        )}

        <div className="flex items-center justify-between">
          {!showResult ? (
            <Button onClick={handleSubmit} disabled={selectedAnswers.length === 0}>
              提交答案
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={currentQuestion === questions.length - 1}>
              下一题
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
          {currentQuestion === questions.length - 1 && showResult && (
            <Badge variant="secondary">
              得分: {score} / {questions.length}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

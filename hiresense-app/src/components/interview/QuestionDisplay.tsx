import { interviewData } from "@/data/mockData";

export function QuestionDisplay() {
  const { question, highlightedWords, currentTopic } = interviewData;

  // Highlight specific words in the question
  const renderQuestion = () => {
    let result = question;
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;

    highlightedWords.forEach((word) => {
      const idx = result.indexOf(word, lastIndex);
      if (idx !== -1) {
        if (idx > lastIndex) {
          elements.push(result.slice(lastIndex, idx));
        }
        elements.push(
          <span key={word} className="text-primary">
            {word}
          </span>
        );
        lastIndex = idx + word.length;
      }
    });

    if (lastIndex < result.length) {
      elements.push(result.slice(lastIndex));
    }

    return elements;
  };

  return (
    <div className="max-w-3xl w-full px-4 lg:px-0">
      <div className="mb-8 lg:mb-12 text-center">
        <span className="text-[10px] lg:text-xs font-bold tracking-[0.2em] text-primary/60 uppercase mb-3 lg:mb-4 block">
          Current Topic: {currentTopic}
        </span>
        <h1 className="text-2xl lg:text-4xl font-extrabold text-on-surface font-headline leading-tight tracking-tight">
          {renderQuestion()}
        </h1>
      </div>
    </div>
  );
}

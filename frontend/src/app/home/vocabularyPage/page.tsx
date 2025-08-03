import Header from "../../../components/Header";
import Navigation from "../../../components/navigation";
import Link from "next/link";

export default function Vocabulary() {
  const lessons = Array.from({ length: 50 }, (_, i) => i + 1);
  return (
    <div className="home-layout">
      <Header />
      <Navigation />
      <main className="main-content">
        <h1 className="text-2xl font-bold mb-4">Từ vựng Minna no Nihongo</h1>
        <ul className="lesson-list">
          {lessons.map((lesson) => (
            <li key={lesson} className="lesson-item">
              <Link href={`/app/home/vocabularyPage/lesson`}>
                Bài {lesson} – Từ vựng
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

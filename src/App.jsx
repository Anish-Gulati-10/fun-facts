import { useEffect, useState, useCallback } from "react";

function App() {
  const [facts, setFacts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFact = async () => {
    const res = await fetch("https://uselessfacts.jsph.pl/api/v2/facts/random");
    const data = await res.json();
    return data.text;
  };

  const loadMoreFacts = useCallback(async () => {
    setLoading(true);
    const newFacts = [];

    for (let i = 0; i < 10; i++) {
      const fact = await fetchFact();
      console.log(fact);
      newFacts.push(fact);
    }

    setFacts((prev) => [...prev, ...newFacts]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMoreFacts();
  }, [loadMoreFacts]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 5 && !loading) {
        loadMoreFacts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreFacts, loading]);

  return (
    <section className="bg-yellow-50/40">
    <div className="max-w-4xl mx-auto px-6 py-8 ">
      <h1 className="text-3xl font-bold mb-6 text-center text-indigo-600">
        Infinite Scroll - Fun Facts
      </h1>

      {facts.map((fact, idx) => (
        <div
          key={idx}
          className="relative shadow-md bg-yellow-50/50 p-6 rounded-lg mb-6 border border-gray-200 transition-transform duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer">
          <div className="text-lg font-semibold text-gray-800">
            <span className="block font-semibold text-indigo-500 mb-1">
              #{idx + 1}
            </span>{" "}
            {fact}
          </div>

          {/* Quote icon on the top-right corner */}
          <div className="absolute top-4 right-4 text-4xl text-gray-300 leading-none select-none">
            &rdquo;
          </div>

          {/* Author */}
          <div className="text-right mt-4 text-sm italic font-medium text-gray-500">
            — Anonymous
          </div>
        </div>
      ))}

      {loading && (
        <div className="text-center text-gray-500 py-4 text-sm">
          Loading more facts...
        </div>
      )}
    </div>
    </section>
  );
}

export default App;

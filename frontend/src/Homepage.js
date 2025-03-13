import React from 'react';

const Homepage = () => {
  return (
    <code>
    <div className="container mx-auto p-4">
      {/* ZippyCode Overview */}
      <section className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 text-accent">ZippyCode</h1>
        <p className="text-xl mb-4">
          ZippyCode is a web-based platform designed to help students practice coding and prepare for Data Structures and Algorithms (DSA) tests.
          Solve problems, post hints/solutions, and collaborate with your peers to master coding challenges!
        </p>
      </section>

      {/* About Section */}
      <section className="text-center">
        <p className="text-lg mb-4">
          ZippyCode is built with the goal of providing students with a platform to practice and excel at coding.
          The platform integrates real-world coding problems, encourages collaborative learning, and includes features for both students and teachers.
        </p>
        </section>
        <section className="text-start">
        <h3 className="text-xl font-semibold text-accent mb-2">Key Features</h3>
        <ol className="list-disc list-inside mb-5">
          <li>Problem Repository: A collection of coding problems with test cases.</li>
          <li>Multi-language support.</li>
          <li>Collaborative Learning: Students can discuss problems and share solutions.</li>
        </ol>

        <p className="text-lg text-center">
          Created by: <strong className="text-accent">Manoj Khatri</strong> and <strong className="text-accent">Suman Khadka</strong>
        </p>
      </section>
    </div>
    </code>
  );
};

export default Homepage;

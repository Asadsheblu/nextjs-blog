import React from "react";

const Faq = () => {
  return (
    <div id="Faq" className="container-fluid bg-light p-5">
      <div className="container">
        <h2 className="text-center headline p-5">FREQUENTLY ASKED QUESTIONS</h2>
        <div className="accordion" id="accordionExample">
          <div className="accordion-item pt-2">
            <h2 className="accordion-header" id="headingOne">
              <button
                className="accordion-button"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseOne"
                aria-expanded="true"
                aria-controls="collapseOne"
              >
                <i className="bi bi-question-circle fs-4 text-primary"></i>
                <span className="fs-4 ps-2">
                  Non consectetur a erat nam at lectus urna duis?
                </span>
              </button>
            </h2>
            <div
              id="collapseOne"
              className="accordion-collapse collapse show"
              aria-labelledby="headingOne"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body title-text fs-6">
                <p className="fs-6">
                What is the best formatter in VS Code? VSCode Prettier is a
                popular code formatter that helps developers format their code
                automatically. In this blog post, we will take a closer look at
                the VSCode Prettier plugin, its benefits, and how to use it.
                We will also explore how Prettier improves TypeScript, CSS, and
                HTML code by looking at some code samples.
                </p>
              </div>
            </div>
          </div>
          <div className="accordion-item mt-4">
            <h2 className="accordion-header" id="headingTwo">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseTwo"
                aria-expanded="false"
                aria-controls="collapseTwo"
              >
                <i className="bi bi-question-circle fs-4 text-primary"></i>
                <span className="fs-4 ps-2">
                  Feugiat scelerisque varius morbi enim nunc?
                </span>
              </button>
            </h2>
            <div
              id="collapseTwo"
              className="accordion-collapse collapse"
              aria-labelledby="headingTwo"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
              What is the best formatter in VS Code? VSCode Prettier is a
                popular code formatter that helps developers format their code
                automatically. In this blog post, we will take a closer look at
                the VSCode Prettier plugin, its benefits, and how to use it.
                We will also explore how Prettier improves TypeScript, CSS, and
                HTML code by looking at some code samples.
              </div>
            </div>
          </div>
          <div className="accordion-item mt-4">
            <h2 className="accordion-header" id="headingThree">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseThree"
                aria-expanded="false"
                aria-controls="collapseThree"
              >
                <i className="bi bi-question-circle fs-4 text-primary"></i>
                <span className="fs-4 ps-2">
                  Dolor sit amet consectetur adipiscing elit?
                </span>
              </button>
            </h2>
            <div
              id="collapseThree"
              className="accordion-collapse collapse"
              aria-labelledby="headingThree"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
              What is the best formatter in VS Code? VSCode Prettier is a
                popular code formatter that helps developers format their code
                automatically. In this blog post, we will take a closer look at
                the VSCode Prettier plugin, its benefits, and how to use it.
                We will also explore how Prettier improves TypeScript, CSS, and
                HTML code by looking at some code samples.
              </div>
            </div>
          </div>
          <div className="accordion-item mt-4">
            <h2 className="accordion-header" id="headingFive">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFive"
                aria-expanded="false"
                aria-controls="collapseFive"
              >
                <i className="bi bi-question-circle fs-4 text-primary"></i>
                <span className="fs-4 ps-2">
                  Dolor sit amet consectetur adipiscing elit?
                </span>
              </button>
            </h2>
            <div
              id="collapseFive"
              className="accordion-collapse collapse"
              aria-labelledby="headingFive"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
                What is the best formatter in VS Code? VSCode Prettier is a
                popular code formatter that helps developers format their code
                automatically. In this blog post, we will take a closer look at
                the VSCode Prettier plugin, its benefits, and how to use it.
                We will also explore how Prettier improves TypeScript, CSS, and
                HTML code by looking at some code samples.
              </div>
            </div>
          </div>
          <div className="accordion-item mt-4">
            <h2 className="accordion-header" id="headingFour">
              <button
                className="accordion-button collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#collapseFour"
                aria-expanded="false"
                aria-controls="collapseFour"
              >
                <i className="bi bi-question-circle fs-4 text-primary"></i>
                <span className="fs-4 ps-2">
                  {" "}
                  Dolor sit amet consectetur adipiscing elit?
                </span>
              </button>
            </h2>
            <div
              id="collapseFour"
              className="accordion-collapse collapse"
              aria-labelledby="headingFour"
              data-bs-parent="#accordionExample"
            >
              <div className="accordion-body">
              What is the best formatter in VS Code? VSCode Prettier is a
                popular code formatter that helps developers format their code
                automatically. In this blog post, we will take a closer look at
                the VSCode Prettier plugin, its benefits, and how to use it.
                We will also explore how Prettier improves TypeScript, CSS, and
                HTML code by looking at some code samples.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;

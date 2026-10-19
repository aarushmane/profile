---
title: "Nemo | Pollution Source Investigation"
category: "Physics Modeling | Software Validation | Sustainability"
group: "project"
period: "HackHarvard | October 16-18, 2026"
summary: "**3rd Overall Best Project** and **2nd, ASUS Save the Earth Sustainability Track** at HackHarvard. I conceived the Grok-assisted physics workflow, built validation and integrity checks, and pitched to judges and sponsors."
date: 2026-10-18
external: "https://nemo-software-demo.onrender.com/"
---

Nemo earned **3rd Overall Best Project** and **2nd in the ASUS “Save the Earth” Sustainability Track** at HackHarvard, October 16-18, 2026. Our team built a research prototype that connects webcam observations, pollution-source modeling, and ocean-current data to investigate possible debris pathways and compare interception layouts.

## My contribution: simulation workflow, validation, and pitching

I conceived the Grok-assisted physics workflow, developed validation tests, helped design experimental protocols, and pitched Nemo to judges and sponsors. My work connected the team's modeling approach to reproducible evidence and a clear technical presentation.

- **Physics workflow and simulation instructions:** Conceived the Grok-assisted workflow and wrote instructions for exploring waste transport through advection, diffusion, Runge-Kutta integration (RK4), and Kalman filtering. Designed the instructions to guide simulation work that could be reused on later samples.
- **Technical pitching:** Presented Nemo to multiple judges and sponsors, including Capital One and startup representatives, explaining the project and its technical approach.
- **Experiment export validation:** Developed tests to verify experimental data exports and check the records used to evaluate trials.
- **Trial-record consistency:** Built checks to detect missing or contradictory trial records, making incomplete or inconsistent evidence visible during review.
- **Data integrity:** Implemented SHA-256 hash checks to verify data integrity and support traceable experimental records.
- **Evaluation protocol design:** Helped design protocols that evaluated physical experiments separately from simulations and preserved reproducibility.

These contributions supported a central engineering requirement: every result needed an identifiable evidence path. A successful software check, a synthetic trajectory, and a physical observation answer different questions; the evaluation process needed to preserve those distinctions.

## What the team built

Nemo combines a local OpenCV green-marker detector, a webcam tank setup, candidate-source comparisons, and historical ocean-motion analysis. A Python/FastAPI backend supports a Next.js and TypeScript interface. Chalk explains bounded evidence from saved reports, while Photon provides a messaging interface to a saved case.

The project compares candidate source regions under declared transport assumptions and can return **Ranked**, **Unknown**, or **Invalid**. Its ocean research uses archived NOAA drifter positions and current datasets to compare motion models and explore earlier and later positions. Interception layouts and a Three.js scene help rehearse possible collection strategies.

## Outcome and next steps

The two HackHarvard awards recognized the team's prototype. The physical source-inference and interception results still require independent validation. The next evaluation steps are blind known-source releases, separately recorded training and validation runs, and observed collection outcomes.

[Try Nemo](https://nemo-software-demo.onrender.com/) · [Devpost submission and my contribution](https://devpost.com/software/nemo-i69rus) · [Source code](https://github.com/Jose-Gael-Cruz-Lopez/reeftrace) · [HackHarvard](https://hhuh.io/)

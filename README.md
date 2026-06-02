# Work

A collection of full-stack and tooling projects. Each folder is a self-contained project with its own setup steps.

## Projects

| Project | Description | Stack |
|---------|-------------|-------|
| [auth-app](./auth-app) | Full-stack app with user signup, login, protected routes, and a dashboard | React, Node/Express |
| [project-quality-dashboard](./project-quality-dashboard) | Dashboard for tracking project quality metrics, containerized with Docker | React, Node/Express, Docker |
| [password-tool](./password-tool) | Password manager and strength checker with a web UI and breach-check (HIBP) integration | Python, Flask |
| [neural-net-mnist](./neural-net-mnist) | Neural network that classifies handwritten digits from the MNIST dataset | Python |

## Getting Started

Each project is independent. `cd` into a folder and follow its own README / install steps — typically:

```bash
# Node projects
npm install && npm start

# Python projects
pip install -r requirements.txt
```

## Notes

`password-tool` ships with no real credentials — its key/database files are excluded via `.gitignore` and should be generated locally when you run it.

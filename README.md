# fullstack-tools-ml

A focused collection of four self-contained projects spanning full-stack web
development, security tooling, and machine learning. Each lives in its own
folder with its own setup steps — built to demonstrate working end-to-end
features, not toy snippets.

The mix is deliberate: a production-shaped auth app, a containerized metrics
dashboard, a security tool that integrates a real external API, and a neural
network trained from the ground up. Together they cover the front end, the
back end, infrastructure, and the model layer.

## Projects

| Project | Description | Stack |
|---|---|---|
| [auth-app](./auth-app) | Full-stack app with user signup, login, protected routes, and a dashboard | React, Node/Express |
| [project-quality-dashboard](./project-quality-dashboard) | Dashboard for tracking project quality metrics, containerized with Docker | React, Node/Express, Docker |
| [password-tool](./password-tool) | Password manager and strength checker with a web UI and breach-check (HIBP) integration | Python, Flask |
| [neural-net-mnist](./neural-net-mnist) | Neural network that classifies handwritten digits from the MNIST dataset | Python |

## How it's organized

Each folder is an independent project — its own dependencies, its own README,
its own run steps. There's no shared build; clone the repo, step into whichever
project you want, and follow that folder's instructions.

- **Web** — `auth-app` (authentication, protected routing, dashboard)
- **DevOps** — `project-quality-dashboard` (metrics UI, Docker)
- **Security** — `password-tool` (Flask web UI, HIBP breach-check API)
- **ML** — `neural-net-mnist` (digit classification on MNIST)

## Getting started

```bash
# Node projects (auth-app, project-quality-dashboard)
npm install && npm start

# Python projects (password-tool, neural-net-mnist)
pip install -r requirements.txt
```

## Notes

`password-tool` ships with no real credentials — its key and database files are
excluded via `.gitignore` and are generated locally when you run it.

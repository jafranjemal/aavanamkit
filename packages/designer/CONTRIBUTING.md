# Contributing to AavanamKit

First off, thank you for considering contributing to AavanamKit! It's people like you that make open source such a great community. We welcome contributions of all kinds, from reporting bugs and proposing new features to improving documentation and submitting code.

This document is a guide to help you through the process.

---
### Code of Conduct

To ensure our community is welcoming and inclusive for everyone, we have adopted a Code of Conduct that we expect all contributors to adhere to. Please take a moment to read it before participating.

**[ &raquo; Read our Code of Conduct ](./CODE_OF_CONDUCT.md)**

---
### How Can I Contribute?

There are many ways to contribute to the AavanamKit project.

- **Reporting Bugs:** If you find a bug, please ensure it hasn't already been reported by searching on GitHub under [Issues](https://github.com/jafranjemal/aavanamkit/issues). If you can't find an open issue, please open a new one with a clear title, a detailed description, and a code sample or steps to reproduce the issue.

- **Suggesting Enhancements:** If you have an idea for a new feature or an improvement to an existing one, please open an issue on GitHub. This allows us to discuss the proposal and ensure it aligns with the project's goals before you spend time on implementation.

- **Answering Questions:** You can help other users by participating in our [GitHub Discussions](https://github.com/jafranjemal/aavanamkit/discussions) and answering their questions.

- **Submitting Code:** If you're ready to contribute code, please follow the process outlined below.

---
### 📦 Getting Started & Local Development

Before you can contribute code, you'll need to set up the project on your local machine.

1.  **Fork the repository:** Click the "Fork" button at the top right of the main repository page.

2.  **Clone your fork:**
    ```bash
    git clone [https://github.com/your-username/aavanamkit.git](https://github.com/your-username/aavanamkit.git)
    cd aavanamkit
    ```

3.  **Install dependencies:**
    This single command installs all dependencies for all packages in the monorepo.
    ```bash
    npm install
    ```

4.  **Run the demo app:**
    To see your changes to the `@aavanamkit/designer` in real-time, run the demo application.
    ```bash
    npm run dev:demo
    ```

---
### 🚀 Submitting a Pull Request

Ready to contribute code? Here’s how to set up your fork and submit a pull request:

1.  **Create a new branch** for your feature or bugfix. All work should be done on a branch created from our `develop` branch.
    ```bash
    git checkout develop
    git pull origin develop
    git checkout -b feature/amazing-new-feature
    ```

2.  **Make your changes** to the code. Ensure you are following the style guides.

3.  **Run tests** to ensure you haven't broken anything.
    ```bash
    npm test --workspace=@aavanamkit/engine
    ```

4.  **Commit your changes** with a descriptive, conventional commit message (see below).
    ```bash
    git commit -m "feat(designer): Add support for PNG export"
    ```

5.  **Push your branch** to your fork on GitHub:
    ```bash
    git push origin feature/amazing-new-feature
    ```

6.  **Open a Pull Request** from your fork to the **`develop` branch** of the main AavanamKit repository. Please provide a clear description of the changes and link to any relevant issues.

---
### ✨ Style Guides

#### Code Style
We use **Prettier** to maintain a consistent code style across the project. Please ensure you run it before committing your changes. You can format all files by running:
```bash
npm run format
```
*(Note: We will need to add a "format" script to our root `package.json` for this to work.)*

### Commit Messages
We follow the **Conventional Commits** specification. This helps us automate versioning and generate changelogs. Your commit messages should be structured as follows:

```<type>[optional scope]: <description>```

- **`feat`**: A new feature.
- **`fix`**: A bug fix.
- **`docs`**: Documentation only changes.
- **`style`**: Changes that do not affect the meaning of the code (white-space, formatting, etc).
- **`refactor`**: A code change that neither fixes a bug nor adds a feature.
- **`chore`**: Changes to the build process or auxiliary tools.

**Example:** `` `feat(engine): Add support for PNG export` ``

Thank you again for your contribution!
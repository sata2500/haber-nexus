# Contributing to HaberNexus

First off, thank you for considering contributing to HaberNexus! It's people like you that make open source such a great community.

This guide will help you get started with contributing to the project.

## Code of Conduct

To ensure a harmonious and respectful environment for all contributors and developers, we have established a [Code of Conduct](CODE_OF_CONDUCT.md). Please read this document and adhere to its rules at all stages of the project.

## How Can I Contribute?

### Reporting Bugs

When you find a bug, please create a new "Bug Report" on GitHub Issues. Try to include the following information in your report:

- **Description of the Bug**: Clearly describe the problem you encountered.
- **Steps to Reproduce**: Explain step-by-step how we can reproduce the bug.
- **Expected Behavior**: State what you would normally expect to happen.
- **Screenshot**: If possible, include a screenshot showing the bug.
- **Environment Information**: Add details about your browser, operating system, etc.

### Feature Requests

If you have an idea for a new feature or improvement, you can create a "Feature Request" on GitHub Issues. In your request, please address the following points:

- **Problem and Solution**: Describe the problem this feature would solve and how it provides a solution.
- **Alternatives**: Are there any alternative solutions you have considered?
- **Additional Information**: Add details or examples of how the feature should work.

### Code Contributions

You can follow these steps to contribute code:

1.  **Fork the Project**: Create a copy of the project in your own GitHub account.
2.  **Clone the Repository**: Download your forked project to your local machine.
    ```bash
    git clone https://github.com/YOUR_USERNAME/haber-nexus.git
    ```
3.  **Create a New Branch**: Create a new branch with a suitable name for your changes.
    ```bash
    git checkout -b feature/new-feature
    # or
    git checkout -b fix/bug-fix
    ```
4.  **Make Your Changes**: Edit the code, add new features, or fix bugs.
5.  **Create Your Commits**: Save your changes with meaningful commit messages. Try to follow the [Conventional Commits](https://www.conventionalcommits.org/) standard.
    ```bash
    git commit -m "feat: Add avatar upload feature for user profiles"
    ```
6.  **Push Your Branch**: Send your changes to your fork on GitHub.
    ```bash
    git push origin feature/new-feature
    ```
7.  **Create a Pull Request (PR)**: Send a Pull Request to the main HaberNexus repository. In the PR description, explain your changes in detail and reference the relevant issue number (e.g., `Closes #123`).

### Code Standards

- **TypeScript**: The project is written in TypeScript. Prioritize type safety and avoid using the `any` type.
- **ESLint**: We use ESLint to maintain code style and quality. Please run `pnpm lint` to fix any errors before committing.
- **Tests**: You are expected to write tests for significant changes (the test infrastructure is not yet set up).

## Development Environment Setup

For detailed setup instructions, follow the "Installation and Setup" section in the [README.md](README.md) file.

Thank you in advance for your contributions!

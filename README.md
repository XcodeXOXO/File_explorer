# Storebox Recursive File Explorer

A custom-built, highly optimized recursive file explorer mimicking the VS Code aesthetic, developed for the Storebox Frontend Engineer Assignment.

## Features

* **Recursive Folder Nesting**: Supports infinite depth for directory structures.
* **Full CRUD Operations**: Create, rename, and delete functionality for both files and folders.
* **Keyboard Accessibility**: Supports standard UX patterns (e.g., `Enter` to confirm renaming, `Esc` to cancel).
* **Zero External Tree Libraries**: Built entirely from scratch without the use of packages like `react-arborist` or `rc-tree` to demonstrate core recursive DOM rendering and state management.

## Architecture & Design Decisions

* **State Management**: Utilizes a custom hook implementing strict immutability. Tree traversals for insertions, updates, and deletions are handled without direct state mutation to ensure rendering stability.
* **Component Structure**:
    * `App.tsx`: Root container handling layout and global actions (+ New File, + New Folder).
    * `Tree.tsx`: Container component mapping the top-level state to the recursive nodes.
    * `TreeNode.tsx`: The recursive atomic unit responsible for local UI state (editing mode, expand/collapse) and action dispatching.
* **Styling**: Pure CSS implemented via `index.css` to manage dynamic indentation based on recursion depth and visual hierarchy.

## Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/XcodeXOXO/storebox-file-explorer.git
    cd storebox-file-explorer
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run the development server:**
    ```bash
    npm run dev
    ```
4.  **Build for production:**
    ```bash
    npm run build
    ```
5.  **View the Live Demo:** [Live Demo](https://file-explorer-swart-seven.vercel.app/)

## Author
**G. Anand Subrahmanian**
* **GitHub**: [XcodeXOXO](https://github.com/XcodeXOXO)
* **Phone (IND)**: +91 9949528201
* **Phone (UAE)**: +971 56 917 5836
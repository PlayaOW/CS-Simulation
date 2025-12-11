# The Silicon Playground

## About the App
The Silicon Playground is an interactive educational application designed to explore fundamental computer science concepts, particularly focusing on CPU architecture and logic. It features a Mini CPU simulator where users can write and execute assembly code, observe CPU registers, and visualize memory state in real-time. This application aims to provide a hands-on environment for understanding how a computer's central processing unit works at a low level.

While primarily focused on computer architecture, this project is also set up as an AI Studio app, indicating potential for integration with AI functionalities.

## Features
- **Mini CPU Simulator**: Write and run simple assembly programs.
- **Real-time Visualization**: Observe Program Counter (PC), Accumulator (AC), and Instruction Register (IR) states.
- **Memory Inspector**: View and understand how data and instructions are stored in memory.
- **Interactive Learning**: Step through execution, pause, and reset the CPU.

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (which includes npm)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/PlayaOW/CS-Simulation.git
    cd CS-Simulation
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up your Gemini API Key (if applicable):**
    If the application utilizes AI Studio features, you may need a Gemini API key. Create a `.env.local` file in the root directory and add your key:
    ```
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    ```
    (Replace `YOUR_GEMINI_API_KEY` with your actual key.)

### Running the Application

To run the application in development mode:

```bash
npm run dev
```

This will typically start a local development server, and you can open the application in your web browser, usually at `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
```

This will create a `dist` directory with optimized static assets, ready for deployment.
# RGB Image Size Rescaling

This project is a web application for processing RGB images, specifically designed for efficient client-side image resizing using various algorithms.

## Setup

To get this project up and running on your local machine, follow these steps:

### Prerequisites

Make sure you have the following installed:

*   Node.js (v18 or later)
*   pnpm (or npm/yarn)

### Installation

1.  Clone the repository:

    ```bash
    git clone https://github.com/anshi05/RGB_Size_Rescaling_SE_Project
    cd RGB_Size_Rescaling_SE_Project

    ```

2.  **Configure Environment Variables**

    Create a `.env.local` file in the root of the project with the following Supabase credentials:

    ```
    NEXT_PUBLIC_SUPABASE_URL=https://wfxjsovjjcclnwagwjei.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmeGpzb3ZqamNjbG53YWd3amVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAzNTE2MTksImV4cCI6MjA3NTkyNzYxOX0.DVnJ0JRvScN7PWoWMedy1PV6pRymS9LysBnXZ7XcrJU
    ```

3.  Install dependencies using pnpm:

    ```bash
    pnpm install
    ```

### Running the Development Server

To start the development server, run:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. The application leverages Next.js for server-side rendering and API routes, though image processing is handled client-side for performance.

## Login Credentials (for testing)

*   **Email:** `anshijio123@gmail.com`
*   **Password:** `Anshi.`

You can singup using your own email also, and then login from that.

## Sample Image for Testing

For testing the image resizing functionality, you can use the `public/test_image.jpg` image available in the project.

## Technologies Used

*   Next.js
*   React
*   Tailwind CSS
*   Shadcn UI


## Image Resizing Algorithms

This application implements three different algorithms for image resizing, each with distinct characteristics regarding performance and output quality:

### Nearest-Neighbor Interpolation

This is the simplest and fastest interpolation method. It assigns the color of the nearest pixel from the original image to the corresponding pixel in the resized image. While very quick, it can result in a blocky or pixelated appearance, especially when images are significantly enlarged. It is best suited for scenarios where speed is paramount and slight quality degradation is acceptable.

### Bilinear Interpolation

Bilinear interpolation calculates the color of a new pixel based on a weighted average of the four nearest pixels in the original image. This method produces a smoother result than nearest-neighbor, effectively reducing aliasing and jagged edges. It strikes a balance between performance and quality, making it suitable for general-purpose image resizing.

### Bicubic Interpolation

Bicubic interpolation is a more sophisticated method that considers 16 (4x4) surrounding pixels to determine the color of a new pixel. It uses a cubic polynomial to achieve a smoother and more accurate result compared to bilinear interpolation. This often yields the best quality for image enlargement, preserving details and minimizing artifacts, though it is the most computationally intensive of the three methods.

## Contributions

*   **Anshi Sachan (231IT008):** Designed the web page UI, implemented the nearest-neighbor interpolation technique, and added user authentication with Supabase integration.
*   **Harsh Revar (231IT055):** Implemented image upload and validation, and the bilinear interpolation technique.
*   **Sameer Jamkhandi (231IT058):** Implemented the bicubic interpolation technique, preview functionality for both original and resized images, and the download functionality for resized images.

## Work Left

*   Storing resized images in supabase.

  


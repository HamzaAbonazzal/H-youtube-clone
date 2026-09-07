# Production-Ready YouTube Clone

A modern, responsive YouTube Clone built with **React**, **TypeScript**, **Tailwind CSS**, **TanStack Query**, and **YouTube Data API v3**.

## Features

- **Real YouTube Data:** Fetches live videos, categories, comments, and channels.
- **Dark / Light Mode:** Fully responsive UI with persistence via LocalStorage.
- **Video Playback:** Implemented via YouTube IFrame Embed API.
- **Watch History:** Tracks user session history locally without a backend.
- **Caching & Performance:** Optimized request management via TanStack Query.
- **Clean Architecture:** Ready for OAuth 2.0 and Backend integration.

## Architecture & Project Structure

- `/api`: Service layer managing YouTube Data API v3.
- `/context`: Theme & application state management.
- `/hooks`: Custom hooks for localStorage & history synchronization.
- `/components`: Modular UI design system using Tailwind CSS.

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/your-username/youtube-clone.git](https://github.com/your-username/youtube-clone.git)
   cd youtube-clone
   ```

# GREG

An implementation of [shadertoy.com](https://www.shadertoy.com/), a **cross-platform web based** tool for sharing, teaching, and learning GLSL Shaders. The website is split into two parts, a reputation based public shader repository that allows for users to share, edit (public forks), and collaborate (like and comment) on GLSL shader code.  We decided to work on this project to apply our learning from CS174A, which many of us took last quarter.

Our website utilizes the MERN stack, and implements a robust user system using JWT authentification, Bcrypt password hashing, and Google OAuth. Shaders are stored as raw text with meta information in the backend and are compiled at runtime using WebGL. The website also feautures an intuitive editor page, where users can edit code with syntax highlighting, select buffers and textures, and interact with their graphics project with fullscreen, play/pause, restart, and fps and elapsed time display functionalities. 

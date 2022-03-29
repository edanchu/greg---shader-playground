# GREG

A tool for sharing, teaching, and learning GLSL Shaders. The website is split into two parts, a reputation based public shader repository that allows for users to share, edit (public forks), and collaborate (like and comment) on GLSL shader code.

Our website utilizes the MERN stack and implements a robust user system using JWT authentification, Bcrypt password hashing, and Google OAuth. Shaders are stored as raw text with meta information in the backend and are compiled at runtime using WebGL. The website also feautures an intuitive editor page, where users can edit code with syntax highlighting, select buffers and textures, and interact with their graphics project with fullscreen, play/pause, restart, and fps and elapsed time display functionalities. 

![Editor!](https://github.com/edanchu/greg/blob/main/images/editor%20page.PNG)


# Installation

* Clone the repo to the desired location on your machine by either using git on the commandline, or by downloading a compressed tarball from github.
* Navigate to the installed directory and then to the client directory (greg/client). Run `npm i`. Then navigate to greg/server and run `npm i` again.
* Navigate to greg/server and create a new file called .env and populate it with the required variables (if you need them, email a contributor).
* If on mac, make sure to enable Webgl2 for safari under Develop > Experimental Features > Enable Webgl2

# Running
* Open two terminal windows.
* In the first navigate to greg/client and run `npm start`
* In the second navigate to greg/server and run `npm start`
* Launch your favorite web browser (with webgl support) and enjoy.

# Attributions
* https://www.humus.name/index.php?page=Textures - Cubemaps

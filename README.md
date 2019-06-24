
# Movie App 

run to install files:
```
npm install
```

run to start server
```
nodemon
```

## API ENDPOINTS

Registration

- POST /auth/register — register users

- POST /auth/login  — login users

- GET /auth/logout — logout users/destroy sessions

- PUT /auth/attributes  { user.id } - edits usernames data, redirects to landing page

**Website interaction**

- GET /chicago-cinema/movies —  (home page) returns all movie events 

- GET /chicago-cinema/movies/attributes { movie.id } -- returns one movie event and MAP COORDINATES of app 

- POST /chicago-cinema/mylist/attributes { movie.id } — adding the movie events to users list

- GET /chicago-cinema/mylist/
— returns list of movie event  on users list

- GET /chicago-cinema/myMovie/attributes { movie.id } —  returns one movie from users movie list

- DELETE /chicago-cinema/myMovie/attributes { movie.id } — deletes current movie  and MAP from users list

- GET /chicago-cinema/plot/attributes {:title} - finds movie description
_


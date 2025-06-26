
# Green Route
Optimize waste route using K-Means clustering and Hybrid of Genetic Algorithm and Simulated Annealing



## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

#### ./frontend/.env.local
```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_ORS_API_KEY=[OpenRouteService API Key] 
```

#### ./backend/.env
Copy .env.example and assign with your environment setup


## Run Locally

Clone the project

```bash
  git clone https://github.com/iccangji/greenroute
```

### Backend
Go to the project directory

```bash
  cd greenroute/backend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

### Frontend
Go to the project directory

```bash
  cd greenroute/frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```


## Tech Stack

**Client:** Next.js, TailwindCSS

**Server:** Node, Express

**Database and ORM**: MySQL, Sequelize

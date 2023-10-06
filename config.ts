const CONFIG = {
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://api.example.com" // TODO: Change this pls
      : "http://localhost:3000",
};

export default CONFIG;

module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/, // Exclude other node_modules
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.m?js$/,
        include: /node_modules\/undici/, // Specifically include undici
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules\/(?!(undici)\/).*/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
       npm install undici@latest
   },
        },
      },
    ],
  },
};

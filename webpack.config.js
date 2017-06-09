module.exports = {
	cache: true,
	devtool: 'inline-source-map',
	module: {
		loaders: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: ['babel-loader'],
			},
		],
	}
};

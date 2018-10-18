require("dotenv").config();

//Add code required to import keys.js file and store in variable
var keys = require("./keys.js");
//variables
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api")
var moment = require("moment");


//argv[2] chooses users actions; argv[3] is input parameter
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words in 2nd user argument
for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}

//fetch spotify keys
var spotify = new Spotify(keys.spotify);

// Function for running a Spotify search - Command is spotify-this-song
var getSpotify = function (songName) {
    if (songName === undefined) {
        songName = "The Sign";
        console.log(songName);
    }
    spotify.search(
        {
            type: "track",
            query: songName
        },

        function (err, data) {
            if (err) {
                return console.log("Error occured: " + err);
            }

            else {    
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                console.log("Song: " + data.tracks.items[0].name);
                console.log("Preview: " + data.tracks.items[3].preview_url);
                console.log("Album: " + data.tracks.items[0].album.name);
            }
        }
    );
};

//Switch command
function switchCommand(userCommand) {

    //choose which statement (userCommand) to switch to and execute
    switch (userCommand) {

        case "concert-this":
            getConcert(secondCommand);
            break;

        case "spotify-this-song":
            getSpotify(secondCommand);
            break;

        case "movie-this":
            getMovie(secondCommand);
            break;

        case "do-what-it-says":
            doWhat(secondCommand);
            break;
    }

    //Bands Town function - command: concert-this
    function getConcert() {
        //search Bands in Town Artist Events API for an artist and render info about event to terminal
        var artist = secondCommand;
        var queryUrl = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

        request(queryUrl, function (error, response, body) {

            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                var data = JSON.parse(body);
                //output to console
                console.log('========== Concert Info ==========')
                for (var i = 0; i < 3; i++) {
                    console.log("Venue: " + data[i].venue.name);
                    console.log("Location: " + data[i].venue.city);
                    console.log("Date: " + moment(data[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY"));
                };
                console.log('========== End of Concert Info ==========')
};
});
};

    //OMDB Movie - command: movie-this
    function getMovie() {
        // OMDB Movie - API request
        var movieName = secondCommand;
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";

        request(queryUrl, function (error, response, body) {

            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);

                //output to console
                console.log('================ Movie Info ================');
                console.log("Title: " + body.Title);
                console.log("Release Year: " + body.Year);
                console.log("IMDB Rating: " + body.imdbRating);
                console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
                console.log("Country: " + body.Country);
                console.log("Language: " + body.Language);
                console.log("Plot: " + body.Plot);
                console.log("Actors: " + body.Actors);
                console.log('=============== Movie Info End ==============');

            } else {
                //else - throw error
                console.log("Error occurred.")
            }
            //Response if user does not type in a movie title
            if (movieName === "Mr. Nobody") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        });
    }

    //Function for command do-what-it-says; reads and splits random.txt file
    //command: do-what-it-says
    function doWhat() {

        //Read random.txt file
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (error) {
                return console.log("Error occured: " + error);
            }

            var dataArray = data.split(",");

            if (dataArray[0] === "spotify-this-song") {
                var songCheck = dataArray[1].slice(1, -1);
                getSpotify(songCheck);
            }
            else if (dataArray[0] === "movie-this") {
                var movieCheck = dataArray[1].slice(1, -1);
                getMovie(movieCheck);
            }
            else if (dataArray[0] === "concert-this") {
                var concertCheck = dataArray[1].slice(1, -1);
                getConcert(concertCheck);
            }

        });
    }
}   //Closes switchCommand function

//Calls switch function
switchCommand(userCommand);

# ng-Parse-Url
An Angular 1.3 application containing a function that given a URL, will return an object containing the URL's route params and their values.

## Motivation
I wrote this small application a few years back, in response to a [question on stackoverflow.com][1]. In particular, the original poster wanted an answer to the following:

> Suppose I have a URL and I want to know information about the route it will map to (in particular, which route parameters it contains and what their values are) without actually following that route. Does an angular service such as $route, $routeParams, or $routeProvider provide a function that will, given a URL, return that information to me?
>
> As an example, if my site was hosted at example.com and I called such a function passing in the argument 'http://example.com#/bar/2/blue' I'd like it to return (something that contains) an object like:
>
> `{ var2a: 2, var2b: 'blue' }`

I found this intriguing and set about creating a `mapUrlToRoute` service with a `getRouteData` function that would accept a URL as input and return the requested object containing that URL's route params and their values.

## Installation
1. Nothing to do here but clone the repo!

## Usage
1. Spin up a server:
    * cd into the _**ng-parse-url**_ folder
    * on Mac or Windows ( using Python 2 ):
      * run `python -m SimpleHTTPServer 8000`
    * on Mac or Windows ( using Python 3 ):
      * run `python -m http.server 8000`
    * visit `localhost:8000` in your browser

1. The home route `http://localhost:8000/#/` shows by default. You can visit the other routes configured in the app by visiting urls matching the following patterns:
    * `http://localhost:8000/#/bar/<somevalue>/<somevalue>`
    * `http://localhost:8000/#/bar/foo/<somevalue>/<somevalue>/<somevalue>`

1. The view associated with each route shows the route params and values for two different URL's supplied in the controller for that view, along with the route params and values for the current URL.

## License
MIT License
https://choosealicense.com/licenses/mit/

[1]: https://stackoverflow.com/questions/30536937/angular-parse-a-url-into-a-route-and-params-without-following-that-url

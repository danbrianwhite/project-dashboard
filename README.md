Project Dashboard
===================
Sample application utilizing React, React Router, Redux, Material-UI, Webpack, and Node build processes.

[View Demo Now!](https://danbrianwhite.github.io/project-dashboard/dashboard)


----------
## Notes about project ##

- Utilized Create React App to setup initial scaffolding. What an improvement over past project setups.
- Utilize Material-UI components throughout the application along with other UI components that work well with Material-UI. These include, better ToolTips, and a SpeedDial Material Design component (save button in right hand corner).
- Implemented Currency Field to properly format and render Material-UI. Additionally, the custom code works well when editing the currency value in the middle of the text. This component wraps the Text Field component to utilize all Material-UI styles. Plan on splitting out the Currency Field component into a separate package in future.
- Implemented custom fade out component to enable the inline saving acknowledgement. 
- Created a mock fetch component to mimic server API calls for saving individual cells.
- Initial Mock Data is loaded in via fetching a JSON file mimicking initially loading the data from the server. 
- React Router was added but only utilized for initial page. Future additions will utilize the router for browser routing without full page loads.
- Added internationalization module to the application and hooked it in. Will refactor non translated/i18n text in future.
- Utilized multiple types of input and filtering techniques to demonstrate various ways structured data can be edited inline or filtered.
- The data records are organized and displayed in cards for quick viewing and to optimize screen space   

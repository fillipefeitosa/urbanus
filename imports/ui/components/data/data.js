import { Template } from 'meteor/templating';

import './data.html';

Template.App_data.onRendered(function(){
    var pivot = new WebDataRocks({
        container: "#wdr-component",
        toolbar: true,
        report: {
            dataSource: {
                filename: "https://cdn.webdatarocks.com/data/data.csv"
            }
        }
    });
})

const apiKey = "5grHcO2A2KcD957WgQNs8YMxcNKAVcZmwfAg8p5E";

function displayResults(results){
    
    if(results.total < 1){
        //if no results returned, display an error
        $('#search-error').text(`Sorry, no parks found. Please try another state`);
    }else{
        const parks = results.data.map(function(entry){
            let physicalLocation='';
            //look for physical address lines
            $.each(entry.addresses,function(){
                let addressType = this.type;
                if(addressType.toLowerCase() === 'physical'){
                    let addressLines = `${this.line1}<br>`;
                    if( this.line2 !== ""){
                        addressLines = `${addressLines}${this.line2}<br>`;
                    }
                    if( this.line3 !== ""){
                        addressLines = `${addressLines}${this.line3}<br>`;
                    }
                    physicalLocation = `<li>
                    Address:<br>
                    ${addressLines}
                    ${this.city}, ${this.stateCode} ${this.postalCode}
                    </li>`;
                }
            });

            return `<li>
            ${entry.name}
            <ul class="park-info">
                <li>${entry.description}</li>
                <li>Website: <a href="${entry.url}" alt="Visit ${entry.name} park's website" target="_blank">${entry.url}</a></li>
                ${physicalLocation}
            </ul>
            </li>`;
        });

        $('#results-list').html(`<li><h2>Search Results</h2></li>${parks.join("")}`);
        //clean up search in progress text
        $('#search-progress').text('');
        //re-enable the form so visitor can search again
        $('#nps-form :input').prop("disabled",false);  

    }
  }
  
function formatQueryString(parameters){
    const paramString = Object.keys(parameters).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parameters[key])}`)
    return paramString.join('&');
}

function getParksData(states,quantity=10){
    const queryParams = {
        api_key: apiKey,
        stateCode: states,
        limit:quantity
    }

    const formattedParameters = formatQueryString(queryParams);
    const url = `https://api.nps.gov/api/v1/parks?${formattedParameters}`;
    
    fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
            $('#search-progress').text(`Sorry, there was an error: ${error.message}`);
        });
}
  
  function initParksFormListener() {
    $('#nps-form').submit(function(event) {
      event.preventDefault();
      //disable form while we're doing a search
      $('#nps-form :input').prop("disabled",true);  

      //clear any previous lists/messages
      $('#search-progress').text('searching!');
      $('#results-list').html('');

      const stateList = $('#state-list').val().toLowerCase();
      const returnQty = $('#max-results').val();

      getParksData(stateList,returnQty);
    });
  }
  
  
  $(initParksFormListener);
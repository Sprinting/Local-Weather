'use strict'

let currentUnit='celsius';

function show_loader()
{
  document.getElementById("loader").style.display="block";
}
function hide_loader()
{
  document.getElementById("loader").style.display="none";
}

function getLocationFromIP(url,callback)
{
  console.log("calling getLocationFromIP");

    return new Promise((resolve,reject) => {
    let request =new XMLHttpRequest();
    request.open('GET',url+callback)
    request.onload= () =>{
      if(request.status==200  )
      {

        resolve(request);
        //console.log("request resovled");
      } //everything's fine
      else {
        reject(Error(request.statusText));
      }
    };
      setTimeout(request.onerror,5000);
      request.onerror = () =>{ reject(Error(request.statusText));};

    request.send();
  //  console.log("request sent confirmed");
  });
};

function getWeatherDetails(url,callback,loc)
{
  console.log("calling getWeatherDetails");

    return new Promise((resolve,reject) => {
    let request =new XMLHttpRequest();
    let furl=url+'&lat='+loc.lat+'&lon='+loc.lon+'&callback='+callback;
    console.log(furl);
    request.open('GET',furl)
    console.log("")
    request.onload= () =>{
      if(request.status==200  )
      {

        resolve(request);
        //console.log("request resovled");
      } //everything's fine
      else {
        reject(Error(request.statusText));
      }
    };
      setTimeout(request.onerror,5000);
      request.onerror = () =>{ reject(Error(request.statusText));};

    request.send();
  //  console.log("request sent confirmed");
  });
};

function temp_converter(t)
{
  let c=(t-273.15).toPrecision(4);
  let f=((9/5)*c+32).toPrecision(4);
  return {
    "kelvin":t,
    "celsius":c,
    "fahren":f
  }
}


function ip_callback()
{
  let args=[...arguments];
  let location={"lat":args[0].lat,
          "lon":args[0].lon,
          "city":args[0].city,
          "country":args[0].country
          }
  //console.log(location);
  return location;
}

function w_callback()
{
  let args=[...arguments][0];

  //console.log(weather);
  return {"time":args.dt,
          "temp":args.main.temp,
          "sum":args.weather[0].description,
          "icon":args.weather[0].icon,
        }
}



window.onload= ()=>{
  let uri="http://ip-api.com/json/?callback=";
  let callback="ip_callback";
  let location,weather,summary;

  document.getElementById("loader").style.display="block";

  let w_uri="http://api.openweathermap.org/data/2.5/weather?appid="
  let   w_api_key="d8827afdb3abe01856143d0dbf14e95a";
  let wcallback="w_callback";
  console.log("Requesting IPINFO");
  let ipPromise=getLocationFromIP(uri,callback);
  ipPromise.then((ipapi) => {
    console.log("evaluating!")
    location=eval(ipapi.response);
    console.log("requesting weather details");
    let coords={
      "lat":location.lat,
      "lon":location.lon
    };
    let wPromise=getWeatherDetails(w_uri+w_api_key,wcallback,coords);
    wPromise.then((wapi) => {
      console.log("parsing weather");
      weather=eval(wapi.response);
      //console.log(weather);
      summary={"w":weather,"l":location};
      let t=temp_converter(summary.w.temp);
      let w_icon_uri= "http://openweathermap.org/img/w/"+summary.w.icon+'.png';
      console.log(summary);
      document.getElementById("loader").style.display="none";
      document.getElementById("city").innerHTML=summary.l.city;
      document.getElementById("country").innerHTML=summary.l.country;
      document.getElementById("temp").innerHTML=t.celsius+' &degC';
      document.getElementById("weather").innerHTML=summary.w.sum;

      //insert icon
      let wicon=document.createElement("img");
      wicon.setAttribute("src",w_icon_uri);
      wicon.setAttribute("class","img img-responsive");
      wicon.setAttribute("alt","Weather-Icon");


      document.getElementById("w_icon").appendChild(wicon);


      let btn_temp=document.getElementById("unit_button");
      $('#temp').on('click',()=>{
        if(currentUnit=='celsius')
        {
          //$('#unit_button').text("Fahrenheit");
          $("#temp").html(t.fahren+' &deg;F');
          console.log(t.fahren);
          currentUnit='fahren';

        }
        else if(currentUnit=='fahren')
        {
          //$('#unit_button').text("Celsius");
          $("#temp").html(t.celsius+' &degC');
          console.log(t.celsius);
          currentUnit='celsius';

        }
      })

    });
    wPromise.catch((err) => {
        console.log("error: ",err);
    });

  });
  ipPromise.catch((err) => {
    console.log("error:" ,err);

  });
};

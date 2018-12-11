const model_list = [{
	"name": "Navigator",
	"manufacturer": "Lincoln",
	"year": 2007
}, {
	"name": "XC90",
	"manufacturer": "Volvo",
	"year": 2011
}, {
	"name": "Echo",
	"manufacturer": "Toyota",
	"year": 2002
}, {
	"name": "SSR",
	"manufacturer": "Chevrolet",
	"year": 2003
}, {
	"name": "Eos",
	"manufacturer": "Volkswagen",
	"year": 2012
}, {
	"name": "B-Series",
	"manufacturer": "Mazda",
	"year": 2003
}, {
	"name": "Q",
	"manufacturer": "Infiniti",
	"year": 1996
}, {
	"name": "Metro",
	"manufacturer": "Geo",
	"year": 1993
}, {
	"name": "Pathfinder",
	"manufacturer": "Nissan",
	"year": 2005
}, {
	"name": "Boxster",
	"manufacturer": "Porsche",
	"year": 2004
}];

const manufacturer_list = [
	"Lincoln",
	"Volvo",
	"Toyota",
	"Chevrolet",
	"Volkswagen",
	"Mazda",
	"Infiniti",
	"Geo",
	"Nissan",
	"Porsche"
];

const user_list = [{
	"fullname": "Kim Delucia",
	"email": "kdelucia0@intel.com",
	"address": "142 Hermina Terrace",
	"city": "Mölnlycke",
	"country": "SE"
}, {
	"fullname": "Care Portt",
	"email": "cportt1@eventbrite.com",
	"address": "2 Nobel Terrace",
	"city": "Oslo",
	"country": "NO"
}, {
	"fullname": "Willem Wombwell",
	"email": "wwombwell2@edublogs.org",
	"address": "06131 Birchwood Terrace",
	"city": "Finspång",
	"country": "SE"
}, {
	"fullname": "Tyrus Allsupp",
	"email": "tallsupp3@goodreads.com",
	"address": "2 Cody Crossing",
	"city": "Trollhättan",
	"country": "SE"
}, {
	"fullname": "Kerrin Vine",
	"email": "kvine4@last.fm",
	"address": "9 Dennis Plaza",
	"city": "Urjala",
	"country": "FI"
}, {
	"fullname": "Drucy Camplin",
	"email": "dcamplin5@stumbleupon.com",
	"address": "0 Pepper Wood Court",
	"city": "Karlstad",
	"country": "SE"
}, {
	"fullname": "Brantley Tokley",
	"email": "btokley6@noaa.gov",
	"address": "6 Birchwood Plaza",
	"city": "Arlöv",
	"country": "SE"
}, {
	"fullname": "Ingemar Harbage",
	"email": "iharbage7@about.me",
	"address": "447 Moland Junction",
	"city": "Lidingö",
	"country": "SE"
}, {
	"fullname": "Martie Carwithim",
	"email": "mcarwithim8@engadget.com",
	"address": "2 Russell Circle",
	"city": "Skien",
	"country": "NO"
}, {
	"fullname": "Boote Croydon",
	"email": "bcroydon9@symantec.com",
	"address": "0244 Buell Circle",
	"city": "Stockholm",
	"country": "SE"
},
{
	"fullname": "Hien Nguyen",
	"email": "hien.nguyen@student.lut.fi",
	"address": "2A18 Punkkerikatu",
	"city": "Lappeenranta",
	"country": "FI"
},
,
{
	"fullname": "Muxing Liu",
	"email": "muxing.liu@student.lut.fi",
	"address": "5 Punkkerikatu",
	"city": "Lappeenranta",
	"country": "FI"
},
,
{
	"fullname": "Tanvir Hassan",
	"email": "tanvir.hassan@student.lut.fi",
	"address": "Unknown",
	"city": "Lappeenranta",
	"country": "FI"
}];

const power_list = [80, 100, 125, 150, 175, 200, 225, 250, 300, 350];

const engine_list = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000, 5500, 6000];

const fuel_list = ['diesel', 'electric', 'lgp', 'petrol', 'other'];

const color_list = ['black', 'blue', 'bronze', 'grey', 'gold', 'red', 'silver', 'other'];

const transmission_list = ['amt', 'automatic', 'manual'];

const cylinder_list = [0, 2, 3, 4, 5, 6, 8, 10, 12];

module.exports = { manufacturer_list, model_list, user_list, power_list, engine_list, fuel_list, color_list, transmission_list, cylinder_list };

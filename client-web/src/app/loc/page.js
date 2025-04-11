"use client";
import React, { useEffect, useState } from 'react';

const nearLoc = {
	"stockTicker": {
		lat: 13.0046224,
		long: 77.5445979
	},
	"weldingMachine": {
		lat: 13.0046236,
		long: 77.5444309
	},
	"mbaBridge": {
		lat: 13.0048915,
		long: 77.544302
	},
	"mbaAILab": {
		lat: 13.0049606,
		long: 77.5443197
	},
	"mbaDigitalClassroom": {
		lat: 13.0050253,
		long: 77.5445982
	},
};

function getDistance(lat1, lon1, lat2, lon2) {
	const toRad = angle => (angle * Math.PI) / 180;
	const R = 6371000; // Earth's radius in meters

	const dLat = toRad(lat2 - lat1);
	const dLon = toRad(lon2 - lon1);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function Home() {
	const [text1, setText1] = useState("");
	const [text2, setText2] = useState("");
	const [updateNo, setUpdateNo] = useState(0);
	useEffect(() => {
		const intervalId = setInterval(() => {
			if (window) {
				console.log("In");
				setUpdateNo(u => u + 1);
				window.navigator.geolocation.getCurrentPosition((position) => {
					const currentLat = position.coords.latitude;
					const currentLong = position.coords.longitude;

					console.log(`Your location: (${currentLat}, ${currentLong})`);
					setText1(`Your location: (${currentLat}, ${currentLong})`);
					let textAll = ""
					for (const [name, loc] of Object.entries(nearLoc)) {
						const dist = getDistance(currentLat, currentLong, loc.lat, loc.long);
						console.log(`${name}: ${dist.toFixed(2)} meters away`);
						textAll += `${name}: ${dist.toFixed(2)} meters away\n`;
					}
					setText2(textAll);

				}, (err) => {
					console.error('Error getting location:', err.message);
				});
			}
		}, 2000);
		return () => clearInterval(intervalId);
	}, []);
	return (
		<div>
			<p>Hello world</p>
			<p>Update No: {updateNo}</p>
			<p>{text1}</p>
			<pre>{text2}</pre>
		</div>
	)
}

export default Home
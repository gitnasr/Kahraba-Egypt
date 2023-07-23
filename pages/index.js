import { useEffect, useState } from "react";

import Clock from "react-live-clock";
import Head from "next/head";
import Image from "next/image";
import { NextSeo } from "next-seo";
import classNames from "classnames";
import moment from "moment/moment";

export default function Home() {
	const [time, setTime] = useState({});

	useEffect(() => {
		const intervalId = setInterval(() => {
			const now = moment(); // Get the current time
			const hour = now.hour(); // Get the current hour
			const minute = now.minute(); // Get the current minute

			// Calculate the start and end of the safe time range
			const safeStart = moment({
				hour,
				minute: Math.max(0, minute - 10),
			}).format("hh:mma");
			const safeEnd = moment({ hour, minute }).format("hh:mm");

			// Calculate the start and end of the danger time range
			const dangerStart = moment({ hour, minute: 50 });
			const dangerEnd = moment({
				hour: hour === 0 ? 23 : hour + 1,
				minute: 10,
			});

			// Calculate the difference in minutes until the next danger time
			let minutesToDangerTime;
			if (now.isBefore(dangerStart)) {
				minutesToDangerTime = moment(dangerStart, "hh:mma").diff(
					now,
					"minutes"
				);
			} else {
				const nextDayDangerStart = moment(dangerStart, "hh:mma").add(1, "day");
				minutesToDangerTime = nextDayDangerStart.diff(now, "minutes");
			}

			// Return the results as objects with formatted time strings and minutes to danger time
			setTime({
				isSafe: minute >= 10 && minute <= 49,
				safeTime: {
					start: safeStart,
					end: safeEnd,
				},
				dangerTime: {
					start: dangerStart.format("hh:mma"),
					end: dangerEnd.format("hh:mma"),
					minutesToNext: dangerStart.diff(now, "minutes"),
					ToEnd: minute >= 50 ? 60 - minute : 10 - minute,
				},
			});
		}, 300); // Updated the interval to 1000 milliseconds (1 second) for better accuracy
		return () => clearInterval(intervalId); // This is important to clear the interval on component unmount
	}, []); // Removed the dependency array since we only need to run the effect once
	const isSafeClassNames = time.isSafe
		? "text-transparent animate-text bg-gradient-to-r from-teal-600 via-green-800 to-emerald-500 bg-clip-text"
		: "text-red-800";
	if (!time.hasOwnProperty("isSafe")) return null;
	return (
		<div
			class='flex flex-col min-h-screen  bg-black  justify-center items-center gap-7  w-full'
			dir='rtl'>
			<NextSeo
				title='الكهرباء هتقطع أمتي'
				description='أمتي الكهربا هتقطع؟ سهلنالك الموضوع وبقي مجرد موقع تفتحه هيقولك فاضل اد ايه علي الكهربا وتقطع وهتقطع ولا لا'
			/>
			<div className='m-auto text-center '>
				<div className='flex flex-col gap-4 px-4'>
					<Clock
						format={"h:mm:ssa"}
						timezone='Africa/Cairo'
						className={classNames(
							"text-6xl sm:text-9xl mb-6 font-bold",
							isSafeClassNames
						)}
						ticking={true}
						noSsr={true}
					/>
					{!time.isSafe ? (
						<div className='text-3xl sm:text-6xl text-white font-bold font-arabic text-center mx-auto max-w-2xl flex flex-col  '>
							<div className='text-center text-transparent animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text my-4'>
								خلي بالك، ده وقت قطع الكهرباء. متركبش الأسانسير ولو بتعمل شغل
								متنساش تعمله سيف
							</div>
							<h4 className='text-lg'>
								وقت الخطر بيبدأ من {time.dangerTime.start} وبينتهي{" "}
								{time.dangerTime.end}
							</h4>
							<h5 className='text-lg'>
								باقى علي زوال وقت الخطر {time.dangerTime.ToEnd} دقايق
							</h5>
						</div>
					) : (
						<div className='text-3xl sm:text-6xl text-white font-bold font-arabic text-center mx-auto max-w-2xl flex flex-col gap-6 '>
							<h1 className='text-center text-transparent animate-text bg-gradient-to-r from-teal-500 via-purple-500 to-orange-500 bg-clip-text'>
								دلوقتي وقت الأمان، لو الكهربا مش قاطعه عندك يبقي مش هتقطع لحد
								{time.dangerTime.start}
							</h1>
							<h5 className='text-lg'>
								{time.dangerTime.minutesToNext === 0
									? "باقي علي وقت الخطر ثواني، خلي بالك"
									: `باقى علي وقت الخطر ${time.dangerTime.minutesToNext} دقايق`}
							</h5>
						</div>
					)}
				</div>
				<img
					src='/logo.png'
					className='w-12 sm:w-12 absolute bottom-5 left-1/2 transform -translate-x-1/2 cursor-pointer'
					alt='Gitnasr.com'
					onClick={() => window.open("https://github.com/gitnasr", "_blank")}
				/>
			</div>
		</div>
	);
}

import axios from "axios";
import cheerio from "cheerio";
import { Scraper, EventData } from "./Scraper.js";

export class HackerEarthScraper extends Scraper {
    constructor() {
        super('hackerearth');
    }

    async scrapeEventPage(eventLink) {
        try {
            const response = await axios.get(eventLink);
            if (response.status === 200) {
                const $ = cheerio.load(response.data);
                const hackathonsSection = $(".ongoing.challenge-list");

                const events = [];

                hackathonsSection.find('.challenge-card-modern').each((index, element) => {
                    const eventName = $(element).find('.challenge-list-title').text().trim();
                    const eventUrl = $(element).find('.challenge-card-wrapper').attr('href');
                    const imageUrl = $(element).find('.event-image').css('background-image').replace(/url\(['"]?(.*?)['"]?\)/, '$1');
                    const companyName = $(element).find('.company-details').text().trim();
                    const registrations = $(element).find('.registrations').text().trim();
                    const startDate = $(element).find('.start-time-block .regular.bold.desc.dark').text().trim();
                    const endDate = $(element).find('.end-time-block .regular.bold.desc.dark').text().trim();

                    const eventData = new EventData({
                        eventName,
                        companyName,
                        registrations,
                        startDate,
                        endDate,
                        imageUrl,
                        eventUrl: `${eventUrl}`,
                    });

                    events.push(eventData);
                });

                return events;
            } else {
                console.error(`Failed to retrieve the page with status code: ${response.status}`);
                return null;
            }
        } catch (error) {
            console.error('An error occurred while scraping the event page:', error);
            return null;
        }
    }
}
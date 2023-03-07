import axios from 'axios';
const path = require('path');

import * as db from '../models/appModel';
import { Request, Response, NextFunction } from 'express';

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-LxbAkppB6j8WEzXVY91pfG4F",
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const suggestionsController = {
    getSuggestions: async(req: Request, res: Response, next: NextFunction) => {
        interface Request {
            resumeText: string,
            jobUrls: string[],
        };
        // console.log('getSuggestions request body', req.body);

        const { resumeText, jobUrls } = req.body.data;
        if (!resumeText || !jobUrls.length) return next({
            log: 'No text provided in getting resume edits',
            status: 401,
            message: {
                err: 'Please provide some resume content',
            },
        });

        let defaultPrompt = 'Here is my resume. Here are links to some jobs that I am interested in: #JOBURLSHERE#. Please provide me with some suggestions on how to make my resume better and rank each job by relevance to my resume.'
        try {
            // const response = await openai.createCompletion({
            //     model: 'gpt-3.5-turbo',
            //     prompt: defaultPrompt.replace('#JOBURLSHERE#', jobUrls.join(', ')) + resumeText,
            //     temperature: 0,
            //     stop: ["\n"],
            // });
            const jobUrlsToString = jobUrls.join(', ');
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY2}`,
            };

            const body = {
                model: 'text-davinci-edit-001',
                input: 'Random Resume Text',
                instruction: `Here is my resume. Here are links to some jobs that I am interested in: ${jobUrlsToString}. Please provide some edits and rank the positions by relevance based on my resume`,
            };

            const response = await axios.post('https://api.openai.com/v1/edits', body, { headers });

            // console.log('OpenAI response to request: ', response.data.choices);

            return res.status(200).json({
                status: 'success',
                suggestions: response.data.choices[0].text,
            });
            
        } catch (err) {
            console.log('Getting resume edits error: ', err);
            return next({
                log: 'Error in suggestionsController',
                status: 500,
                message: {
                    err,
                },
            });
        };
    },
};

export default suggestionsController;
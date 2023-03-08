import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    organization: "org-TxyeUnG5lXrJH5JqDkgsrjBF",
    apiKey: process.env.OPENAI_API_KEY2,
});
const openai = new OpenAIApi(configuration);

const suggestionsController = {
    getSuggestions: async(req: Request, res: Response, next: NextFunction) => {
        interface Request {
            resumeText: string,
            jobUrls: string[],
        };
        // console.log('getSuggestions request body', req.body);

        const { resumeText, jobDescriptions } = req.body.data;
        if (!resumeText || !jobDescriptions.length) return next({
            log: 'No text provided in getting resume edits',
            status: 401,
            message: {
                err: 'Please provide some resume content',
            },
        });

        try {
            const jobUrlsToString = jobDescriptions.join(', ');
            const input = resumeText;
            const instruction = `Here are job descriptions I'm interested in: ${jobUrlsToString}. Please provide some suggestions on how to make my resume better and rank these jobs: ${jobUrlsToString} by relevance based on my resume`;

            // const headers = {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${process.env.OPENAI_API_KEY2}`,
            // };

            // const body = {
            //     model: 'text-davinci-003',
            //     prompt: input + instruction,
            // };

            // const response = await axios.post('https://api.openai.com/v1/completions', body, { headers });
            const response = await openai.createChatCompletion({
                model: 'gpt-3.5-turbo',
                messages: [{
                    'role': 'user',
                    'content': input + instruction,
                }]
            });

            return res.status(200).json({
                status: 'success',
                suggestions: response.data.choices[0].message,
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
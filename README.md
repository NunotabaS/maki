マキ (Maki)
============
Maki is an AI program based on Node.js to automatically learn from Sina Weibo. 
It keeps on reading new Weibo through the public API and continuously builds 
into a large Hidden Markov Model (HMM). 

配備 (Deploy)
------------
必要ソフト：
- Mongo DB （データベース用）


Before deploy, please fill out `config.sample.js` and rename to `config.js`. 
Then run 

    npm install

and run the collector with `node maki.js`. When you're satisfied, run 
`node makigen.js` to generate some very deep thoughts about life in China.


LICENSE
------------
Maki is released under the MIT License.

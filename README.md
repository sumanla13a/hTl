# hTl

<ul>Configurations => 
  <li>Basic configurations goes in /configurations/config.json</li>
  <li>O-auth configurations for facebook, google ... => /configurations/auth.json</li>
</ul>
<code> Note: basic configurations => configurations/sample.config.json</code>

<strong>To create a mongodb collection.</strong>
<ul>
  <li> run app</li>
  <li> localhost:port and follow the action</li>
</ul>

<code> Note: Create a folder and replace `modelFolder` in config.json with that folder.</code>
<code> create a new folder in that folder with a json file of same name. Add mongoose schema there to create collection and basic rest apis</code>

<Strong> The hooks will be in the same folder as model schema. Each hook file must export a function.</Strong>

// Idea bank. One idea per line: "Title :: pitch" or "Title :: pitch :: tags". Kept as
// template blocks so quotes and apostrophes need no escaping. `npm run check` validates it.
// Tags say what a build needs: ai (an LLM or AI API), db (accounts or stored data),
// pay (takes payments), hw (camera, mic, GPS or sensors). No tags means no backend.
// Only ever APPEND ideas: an idea's id is its category key plus its index, and share
// links, challenges and (later) votes are keyed by it.

export type Category = {
  key: string;
  name: string;
  emoji: string;
  color: string;
  ideas: string[];
};

const lines = (block: string) =>
  block
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

export const CATEGORIES: Category[] = [
  {
    key: "money",
    name: "Money Maker",
    emoji: "💰",
    color: "#1f9d55",
    ideas: lines(`
Invoice Nagger :: Auto-escalating reminders for unpaid freelance invoices that go from sweet to icy over 30 days. :: db
Menu Polyglot :: Restaurants snap their menu and get a QR code serving it in 20 languages with allergen tags. :: ai db hw
Churn Whisperer :: Connect Stripe, flag customers who are about to cancel, and draft the win-back email for you. :: ai db
60-Second Local SEO Audit :: Type a business name, get a one-page report of what is broken on its Google profile. Sell the fix. :: ai pay
Niche Job Board :: A job board for one tiny niche (remote marine biologists, Rust game devs) with paid listings. :: db pay
Receipt Forwarder :: Forward receipts to an email address and get a tax-ready categorized spreadsheet in April. :: ai db
Landlord Fix Queue :: Tenants report issues with photos; landlords get a triaged queue with contractor links. :: db
Competitor Pricing Watch :: Track the pricing pages of competitors and get pinged the moment they change. :: db
Podcast to Newsletter :: Each episode becomes a newsletter, show notes, and five social posts automatically. :: ai db
Etsy Listing Doctor :: Paste an Etsy listing and get a rewritten title, 13 tags, and a photo checklist. :: ai
Dog Walker in a Link :: Link-in-bio booking, calendar, and payments for solo dog walkers. :: db pay
Five-Dollar Status Page :: Dead-simple hosted status pages for indie makers. Charge five bucks a month. :: db pay
Contract Red Flags :: Upload a freelance contract and the scary clauses get highlighted in plain English. :: ai
Class Waitlist Autopilot :: Auto-fills cancelled gym and yoga class spots from a waitlist over SMS. :: db
Airbnb Guidebook Builder :: Hosts answer ten questions and get a beautiful digital house manual with local tips. :: db
Testimonial Wall :: Collect video testimonials by link and embed a glowing wall on any site. :: db hw
First-Line Personalizer :: Writes the opening line of a cold email from the prospect's public website. :: ai
Neighborhood Tutor Market :: A local marketplace for high-school tutors sorted by subject, grade and price. :: db
Abandoned Cart Postcard :: Send a real paper postcard to Shopify shoppers who abandon their carts. :: db pay
Rate Calculator Lead Magnet :: Tells freelancers their hourly rate from salary goals, taxes and vacation. Upsell a course.
Changelog as a Service :: Gorgeous hosted changelogs plus an in-app what-is-new widget. :: db
Event Photo Finder :: Guests upload one selfie and get every event photo they appear in. :: ai db hw
Listing Writer for Realtors :: Upload house photos, get a compelling listing and room-by-room summary. :: ai
No-Show Killer :: SMS reminders with one-tap reschedule for dentists, barbers and small clinics. :: db
Paywall for Notion :: Sell access to any Notion page with Stripe in two clicks. :: db pay
Car Wash Membership :: Recurring memberships with license-plate check-in for independent car washes. :: db pay hw
Resume Roaster Pro :: A free, brutal resume roast. The rewrite costs nine dollars. :: ai pay
Metered Billing Kit :: Drop-in usage-based billing for tiny API businesses. :: db pay
Farm Box Preorders :: A weekly preorder page for farms selling veggie boxes, with pickup slots. :: db pay
Salon Rebook Nudge :: Texts clients when their usual haircut interval is up, with a booking link. :: db
Grant Matcher :: Matches small nonprofits to grants they actually qualify for, with deadlines. :: ai
Vertical Extension Bundle :: A subscription bundle of browser extensions for one profession, like real estate agents. :: db pay
Course Quiz Generator :: Upload a course video and get quizzes, flashcards and a certificate page. :: ai db
Blog Post to Lead Magnet :: Turns any blog post into a downloadable checklist PDF behind an email capture. :: ai db
Neighbor Gear Rental :: Rent your camera, drone or tent to neighbors, with deposits held by Stripe. :: db pay
Handyman Photo Quote :: Customers photograph the job and get an instant price range and a booking link. :: ai db hw
Inside Joke Merch :: A friend group uploads its inside jokes and gets a print-on-demand merch store. :: db pay
Newsletter Ad Slots :: A marketplace where small newsletters list sponsor slots and brands book them. :: db pay
Meeting Cost Meter :: A calendar add-on that shows the dollar cost of every meeting. Managers will pay.
Creator Money Dashboard :: YouTube, Patreon and sponsor income in one place, with tax estimates. :: db
AI Receptionist for Plumbers :: Answers the phone, qualifies the job and books it into the calendar. :: ai db
Chat to Invoice :: Screenshot the chat where a client agreed to a price and get a ready invoice. :: ai
Cafe Menu Boards :: Turn any TV into a cafe menu board controlled from your phone. :: db
Indie Game Presskit :: Generates a press kit page plus a list of journalists who cover your genre. :: ai
README Tip Jar :: One-click sponsorship widgets for open source READMEs. :: db pay
Day Pass Finder :: Book day passes at cafes and coworking spaces in any city. :: db pay
Conversation Slots :: Native speakers sell twenty-minute conversation practice slots. :: db pay
Pet Plan Comparator :: Compares pet insurance plans for your exact breed and age.
Wedding Budget Referee :: A shared wedding budget that gently tells couples which cost is out of line. :: db
Micro-Agency in a Box :: A template site plus proposal generator for one-person design agencies. :: ai
Price Anchor Calculator :: Enter your product and see how three pricing tiers change what buyers pick, with the maths shown.
Side Hustle Hour Math :: Shows what your side hustle really pays per hour once fees, taxes and unpaid admin are counted.
`),
  },
  {
    key: "world",
    name: "Change the World",
    emoji: "🌍",
    color: "#2779bd",
    ideas: lines(`
Food Rescue Alerts :: Bakeries post end-of-day leftovers and nearby shelters get an instant alert. :: db
Blood Donor Buddy :: Reminds you the day you can donate again and books the nearest slot. :: db
Accessible Route Map :: A crowdsourced map of ramps, elevators and broken lifts for wheelchair users. :: db hw
Scary Letter Decoder :: Paste a scary government letter and learn what it means and what to do next. :: ai
Elder Call Roster :: Volunteers sign up to call an isolated senior once a week. :: db
Repair Cafe Finder :: A map of places that fix things instead of throwing them away.
Carbon Receipt :: Scan a grocery receipt, see its footprint, and get one easy swap. :: ai hw
Asylum Paperwork Guide :: Step-by-step checklists for asylum paperwork in thirty languages.
Classroom Wishlist :: Teachers post what their classroom needs and neighbors fund it directly. :: db pay
Tree Tracker :: Log every tree you plant with a photo and GPS, and watch the forest grow on a map. :: db hw
Grandparent Pill Reminder :: Huge buttons, voice reminders, and family gets notified if a dose is missed. :: db
Street Tool Library :: Lend and borrow drills, ladders and pressure washers on your street. :: db
Thirty-Second Mood Check :: A daily mood check-in that surfaces real help when things dip.
Volunteer Passport :: Log volunteer hours across organizations and export them for school or jobs. :: db
Water Quality Map :: Water reports and boil notices near you, explained simply. :: hw
Vote in Sixty Seconds :: Enter your address and learn where, when and how to vote.
Litter Leaderboard :: Photo-verified trash pickups and a friendly neighborhood leaderboard. :: db hw
Five Signs a Day :: Learn five sign-language signs a day from tiny video clips.
Safety Exit App :: A disguised app with a quick-exit button, safety plans and hotlines for abuse survivors.
Free Tutoring Bridge :: University students tutor kids from low-income families over video. :: db hw
Disaster Check-In :: A simple I-am-safe check-in map for families after floods or earthquakes. :: db hw
Pantry Needs Board :: Food pantries post what they need most right now, so donations match. :: db
Energy Bill Decoder :: Upload your energy bill and get the three biggest savings for your home. :: ai
Uniform Swap :: Parents swap outgrown school uniforms by size and school. :: db
Hear Your Site :: Paste a URL and hear how a screen-reader user experiences your website.
Bike Lane Snitch :: Photograph a blocked bike lane and it goes straight to the city with location. :: db hw
Kid Micro-Grants :: Kids pitch small projects and the community funds fifty-dollar grants. :: db pay
Doctor Note Explainer :: Paste a medical note and get it explained kindly in plain words. :: ai
Donation Router :: Tells you which nearby charity actually needs the stuff you want to donate. :: db
Pollinator Planner :: Enter your region and get a bee-friendly planting plan for your balcony or yard.
Open Now Services :: Shelters, showers and meals that are open right now, working offline. :: db
Second Chance Interviews :: Mock interviews and resume help for people leaving prison. :: ai
Heatwave Buddy :: Pairs neighbors to check on vulnerable people during heatwaves. :: db
Scam Drill for Parents :: Send your parents harmless fake scam texts and teach them what to spot. :: db
Nonprofit Good First Issues :: A board of beginner-friendly issues from nonprofit codebases.
Little Library Live :: A map of little free libraries with what is inside them right now. :: db
Hospital Ride Share :: Matches rural patients who need a ride to treatment with volunteer drivers. :: db hw
Expiring First :: Photograph your fridge and get recipes for whatever expires soonest. :: ai hw
Kindness Streak :: One small kind act prompt a day, with streaks and zero guilt.
Beach Haul Log :: Log beach cleanup hauls in a format ocean researchers can use. :: db
Period Product Map :: Where to find free pads and tampons in schools and public buildings. :: db
Wildlife Crossing Reporter :: Log roadkill hotspots so cities know where to build crossings. :: db hw
Teen Tech Helpers :: Teens book video calls to help seniors with their phones. :: db hw
Receipts-Only Charity :: A donation tracker that shows exactly how every dollar was spent. :: db pay
Clean Air Walk :: Routes kids to school through the least polluted streets. :: hw
Community Fridge Map :: Public fridges near you and what is in them today. :: db
Dyslexia Reader :: Paste any text and read it with a friendly font, spacing and read-aloud.
Newcomer Phrasebook :: Survival phrases for your new country organized by real situations.
Rent Hike Checker :: Find out if your rent increase is legal where you live.
Mentor Bridge :: Thirty-minute mentor calls between experienced founders and first-timers in developing countries. :: db hw
Round-Up for Good :: Rounds up card purchases and sends the spare change to one local cause each month. :: db pay
Pay-It-Forward Coffee :: Buy a coffee for a stranger at a local cafe. The next person who needs one claims it with a code. :: db pay
`),
  },
  {
    key: "funny",
    name: "Absurd & Funny",
    emoji: "🤡",
    color: "#e3342f",
    ideas: lines(`
Standup Excuse Engine :: Increasingly elaborate excuses for missing standup, rated by believability. :: ai
Passive-Aggressive Post-It :: Generates office fridge notes in twelve escalating levels of passive aggression. :: ai
Michelin Sandwich Critic :: Upload a sandwich and an AI food critic reviews it with devastating seriousness. :: ai
Pigeon Stock Exchange :: Trade fictional shares in the pigeons of your city. :: db
Shakespearean Weather :: Tomorrow's forecast, narrated as a five-act tragedy. :: ai
Meeting Bingo Live :: Multiplayer buzzword bingo for your next all-hands. :: db
Wrong Cat Translator :: Records your cat and confidently mistranslates every meow. :: hw
LinkedIn Lunatic :: Turns mundane events into LinkedIn posts. I dropped my toast. Here is what it taught me about B2B sales. :: ai
Applause on Demand :: A button that plays a roaring crowd whenever you finish a chore.
Doom Scroll Tax :: Every hour on social media donates a dollar from you to charity. :: db pay
Houseplant Tinder :: Swipe right to match houseplants that would look good together.
Complaints Department of the Universe :: File formal complaints about gravity, Mondays and socks. Get official responses. :: ai
App Breakup Letters :: Writes heartfelt goodbye letters to the apps you uninstall. :: ai
Grandma Code Review :: Your code review comments rewritten by a loving but disappointed grandmother. :: ai
Judgy Fridge :: A fridge-cam app that sighs audibly when you open it at 2am. :: hw
Villain Origin Story :: Describe one minor inconvenience and get your full villain backstory. :: ai
Lone Sock Registry :: Report a lonely sock and search the global database for its soulmate. :: db
Emoji Court :: Friends submit petty disputes and a jury rules using emojis only. :: db
Office Chair Grand Prix :: Timing, brackets and a leaderboard for office chair races. :: db
Villain Motivation :: Daily motivational quotes from fictional villains.
Procrastination Planner :: Optimally schedules your procrastination so you never feel guilty again.
Rubber Duck Hotline :: Explain your bug to an animated duck that quacks thoughtfully back. :: hw
Negotiating Alarm Clock :: To snooze, you must win an argument against the AI. :: ai
Dev Horoscopes :: Mercury is in retrograde. Do not deploy on Friday.
Look Busy Screen :: A convincing fake loading screen for when you just need to think.
Petty Wi-Fi Names :: Generates passive-aggressive Wi-Fi names aimed at your neighbors.
Parking Spot Haiku :: Leave anonymous haikus pinned to parking spots for the next driver. :: db hw
Morning Speedrun :: A global leaderboard for the fastest morning routines, with splits. :: db
Reply-All Apocalypse :: Watch a simulated company email thread spiral into chaos.
Pet LinkedIn :: A professional resume and endorsements page for your dog. :: db
Overthinking Visualizer :: Type the text you want to send and see forty ways it could be misread. :: ai
Banana for Scale :: Upload any photo and get its size measured in bananas. :: ai
Evil Autocorrect :: Shows what your message would say if autocorrect had a grudge. :: ai
Snack Stock Market :: Office snacks priced live by demand. Buy low, eat high. :: db
Chore Wheel of Doom :: Dramatic roommate chore assignment with suspense music and a spotlight.
Wholesome Conspiracies :: Harmless conspiracy theories about your coworkers. Dave is secretly three raccoons. :: ai
Unnecessary Pie Chart :: Turns any sentence into a pie chart nobody asked for.
Dramatic Exit :: Leave a video call with a cinematic explosion and slow-motion walk away. :: hw
Rate My Parking :: Photograph terrible parking and let the internet judge it. :: db hw
The Button :: A single button, a global counter, and absolutely no explanation. :: db
Graceful Group Chat Exit :: Generates a dignified farewell when you leave a group chat. :: ai
Codebase Mood Ring :: Reads your commit messages and shows the emotional state of your repo. :: ai
Plant Obituaries :: Beautiful memorial pages for the houseplants you did not keep alive. :: db
Pineapple Tribunal :: Settle pizza topping disputes with a formal, binding vote. :: db
Spreadsheet Love Letter :: Write a love letter that only reveals itself when the formula runs.
Couponing for Time :: Finds five-minute gaps in your calendar and lets you redeem them. :: db
Commute Quest :: Your bus ride becomes a text adventure with stops as dungeon levels. :: hw
Scream Exchange :: Record a scream and it gets played to a random stranger somewhere. :: db hw
Pirate Lingo Academy :: Learn fluent pirate in thirty days with streaks and parrots.
Useless Superpower :: Get assigned a superpower, like always finding the end of the tape.
Pay to Pop :: One virtual balloon anyone can pay a dollar to pop. It reinflates and the price doubles. :: db pay
Overpriced Nothing Store :: Sells beautifully designed receipts for nothing at all, with a certificate of purchase. :: pay
Sponsor a Pixel of Silence :: Buy one pixel of a blank white page for a dollar. The page stays blank forever. :: db pay
Rent a Nemesis :: Pay five dollars and a stranger becomes your dramatic rival for a week, with weekly taunts. :: db pay
`),
  },
  {
    key: "dev",
    name: "Dev Tools",
    emoji: "🛠️",
    color: "#6c5ce7",
    ideas: lines(`
README Roaster :: Paste a README, get a score out of ten and a rewrite that sells. :: ai
Env Diff :: Compare .env files across environments and spot missing keys without showing values.
Regex Railroad :: Paste a regex and see it as a railroad diagram with plain-English steps.
Diff to Commit :: Turns a git diff into a clear conventional commit message. :: ai
Instant Mock API :: Paste JSON and get a live mock endpoint URL in one click. :: db
Cron Whisperer :: Plain English to cron and back, with the next ten run times.
Dependency Graveyard :: Scans package.json for abandoned packages and suggests living alternatives.
Screenshot to Tailwind :: Upload a UI screenshot and get clean Tailwind HTML. :: ai
Stack Trace Sherpa :: Paste a stack trace and get the likely cause and linked GitHub issues. :: ai
Pretty Tunnels :: A localhost tunnel with memorable URLs and a request log. :: db
Join Visualizer :: See your SQL joins as animated Venn diagrams.
JSON to Zod :: Paste JSON and get TypeScript types plus a Zod schema.
PR Storyteller :: Writes a pull request description from the diff, with a testing checklist. :: ai
Flags in a File :: A feature flag dashboard for solo devs, backed by one JSON file.
Lighthouse Diary :: Tracks a site's performance scores daily and charts regressions. :: db
Docs Link Doctor :: Crawls a docs site and reports every dead link and missing anchor. :: db
Webhook Catcher :: Catch, inspect and replay webhooks from any service. :: db
Git Blame Therapist :: Shows who wrote this line and why, with kindness and context. :: ai
Brand Extractor :: Enter a URL and pull its colors, fonts and logo as design tokens.
OG Image API :: Beautiful social cards from URL parameters.
Context Cheatsheet :: Suggests terminal commands based on the project you are in.
Specificity Arena :: Two CSS selectors enter, one leaves, with the math explained.
Bundle Budget Bot :: Comments on pull requests when the bundle grows past a budget. :: db
Animated Code Cards :: Code snippets rendered as animated images for social posts.
Side Project Uptime :: An uptime monitor that texts you when a side project goes down. :: db
Schema Seeder :: Realistic fake seed data generated from your database schema. :: ai
HTTP Cats Flashcards :: Learn every HTTP status code with a cat for each one.
Tech Debt Milk :: Tags TODOs in code and shows them aging like milk in a fridge.
Token Converter :: Figma variables to CSS, Tailwind and Swift in one paste.
Monorepo Map :: An interactive dependency graph for your monorepo packages.
String Extractor :: Finds hardcoded UI strings and extracts them into i18n JSON.
Prompt Vault :: Version-control your AI prompts with diffs and regression tests. :: ai db
LLM Bill Estimator :: Estimates your AI bill from expected traffic and prompt sizes.
Compose Visualizer :: Draws your docker-compose file as a service diagram.
Timezone Overlap :: Finds meeting times that are humane for a distributed team.
Extension Starter :: Generates a ready-to-load browser extension from a description. :: ai
Rate Limit Tester :: Safely hammers your own API and charts response times and 429s.
Favicon Everything :: One image in, every favicon size and manifest out.
Markdown Resume :: Write your resume in Markdown and get a beautiful PDF.
Repo Onboarding Guide :: Scans a repo and writes how this codebase works for new contributors. :: ai
Flaky Test Detective :: Runs your test suite many times and ranks the flakiest tests.
Code Vibe Check :: Rates the vibe of a file and suggests refactors with personality. :: ai
Deploy Button Maker :: Generates one-click deploy buttons for any repo.
Standup from Git :: Writes your standup update from yesterday's commits and PRs. :: ai
Secret Scan Explainer :: A pre-commit hook that catches secrets and explains why each one matters.
Shortcut Dojo :: A game that trains you on editor keyboard shortcuts.
Changelog from Tags :: Builds release notes from git tags and merged pull requests.
API Diff Watch :: Alerts you when a third-party API's OpenAPI spec changes. :: db
Color Contrast Fixer :: Paste two colors and get the nearest accessible pair.
Error Budget Board :: A tiny SLO dashboard for teams without an SRE. :: db
License Key Server :: Sell your desktop app with Stripe and issue license keys it can verify offline. :: db pay
Paid Bug Bounty Board :: Maintainers post small cash bounties on issues and pay out when the PR merges. :: db pay
Sponsorware Unlocker :: A repo goes public once sponsors fund a goal, with a live progress bar. :: db pay
Code Review for Hire :: Book a senior dev to review one pull request for a fixed price. :: db pay
API Key Storefront :: Turn any API you built into a paid product with keys, quotas and Stripe billing. :: db pay
Clap to Deploy :: Clap twice at your laptop and the mic triggers your deploy script. Very dramatic. :: hw
Posture Guard :: Your webcam notices you slouching over the keyboard and nudges you to sit up. :: hw
Voice Commit Messages :: Say what you changed out loud and it becomes a tidy commit message. :: hw
Shake to Report Bug :: Shake your phone on a test build and it files a bug with a screenshot and device info. :: db hw
Gesture Scroll for Docs :: Scroll docs and code with hand gestures in front of the webcam while you eat lunch. :: hw
`),
  },
  {
    key: "games",
    name: "Games & Toys",
    emoji: "🎮",
    color: "#f6993f",
    ideas: lines(`
Satellite Guessr :: Guess the country from a tiny satellite snippet. One puzzle a day.
Emoji Movie Wordle :: Guess the movie from five emojis in six tries.
Drawing Telephone :: A multiplayer game of draw, describe, draw again. Laughter guaranteed. :: db
Tab Title Tower Defense :: A tower defense game that lives entirely in the browser tab title.
Guess the Year :: A historic photo appears. Guess the year it was taken.
Lyric Typing Racer :: Race friends by typing song lyrics in time with the beat. :: db
Startup Idle Clicker :: Click to raise funding, hire interns and survive the burn rate.
One-Page Escape Room :: An escape room hidden inside a single web page.
Pixel Garden :: Everyone on Earth plants one pixel per day on a shared garden. :: db
Chess Variant Lab :: Invent chess variants with custom pieces and play them online. :: db
Trivia Night Host :: Big-screen questions with phones as buzzers. :: db
Adventure Book Maker :: Build choose-your-own-adventure stories with a visual map.
Grocery Price Guessr :: Guess what a loaf of bread costs in Tokyo, Lagos or Oslo.
MP3 Rhythm Game :: Upload a song you own and get a generated rhythm level.
Commit Tamagotchi :: A virtual pet that thrives on your GitHub commits and wilts without them.
Global Daily Sudoku :: One sudoku per day with a worldwide leaderboard. :: db
Marble Run Sandbox :: Build physics marble runs and share them by link.
Planet Snake :: Multiplayer snake on a globe with players worldwide. :: db
Guess the Language :: Hear a clip of speech and guess the language.
Hot Take Arena :: Two opinions, one vote, and a live world tally. :: db
Minigolf Editor :: Design minigolf holes and challenge friends to beat your par.
Group Chat Crossword :: A crossword generated from your group chat's inside jokes. :: ai
Bubble Wrap Forever :: Endless bubble wrap popping with satisfying sound design.
Reality TV Fantasy League :: Draft contestants and score points for drama. :: db
Birdsong Quiz :: Learn birds by their songs, level by level.
Board Game Scorekeeper :: A scorekeeper for any board game with stats over time.
Spot the AI :: Real photo or AI? A daily quiz with global accuracy stats. :: db
Trolley Problem Stats :: Absurd trolley dilemmas and how the world voted. :: db
Custom Card Game Engine :: Design your own deck and play it online with friends. :: db
Chore Quest :: Household chores become RPG quests with XP and loot for kids.
Paper Plane Lab :: Fold virtual planes and test them in a wind tunnel.
Emoji Fusion Battle :: Combine emojis into creatures and battle them.
Type to Shoot :: Asteroids where you destroy rocks by typing the words on them.
GPS Treasure Hunt Maker :: Make a treasure hunt with GPS clues for a birthday party. :: db hw
Daily Maze :: A new maze every day and a ghost replay of the fastest run. :: db
Charades Randomizer :: Party charades with categories, a timer and team scores.
Flag Speedrun :: Name all flags as fast as possible and chase your best split.
Terminal Dungeon :: A roguelike you run with one npx command.
Tiny City Builder :: A city builder on a 100 by 100 grid that fits in one tab.
Guess the Elo :: Watch a chess game and guess the players' rating.
Work Email Mad Libs :: Mad libs built from real corporate email templates.
Rock Paper Scissors League :: Ranked rock paper scissors with seasons and Elo. :: db
Would You Rather Worldwide :: Would-you-rather dilemmas with live global percentages. :: db
Ghost Racer :: A tiny top-down racer where you race your own ghost.
Blind Test Party :: A music blind test where friends buzz in from their phones. :: db
Nonogram Factory :: Generates picture logic puzzles from any image.
Floor Is Lava :: A kids party timer that randomly yells floor is lava.
Word Chain Duel :: Each word must start with the last letter of the previous one. Fast. :: db
Gravity Golf :: Golf across planets with gravity slingshots.
Hide and Seek Map :: Hide an object in a panoramic photo for friends to find. :: db hw
Twenty Questions Oracle :: Think of anything and an AI guesses it in twenty questions, then explains its reasoning. :: ai
Riddle Duel :: Trade riddles with an AI. It rates yours for cleverness and you rate its. :: ai
Infinite Crafting Kitchen :: Combine two ingredients and an AI invents what they make. Hunt for the rarest dish. :: ai db
Detective Interrogation :: Interrogate AI suspects in a murder mystery. They lie, but not consistently. :: ai
Level Pack Shop :: A puzzle game where players build level packs and sell them for a dollar. :: db pay
Pay-What-You-Want Arcade :: A tiny arcade of browser games unlocked by any payment, even one cent. :: pay
Custom Crossword Gifts :: Order a printed crossword made from a couple's shared memories, delivered as a gift. :: ai pay
Charity Speedrun Night :: Speedrun events where every donation unlocks a silly handicap for the runner. :: db pay
Party Game Pack Store :: Sell themed card packs for your own party game, unlocked right after checkout. :: db pay
Tilt Maze :: Tilt your phone to roll a marble through a maze using the motion sensors. :: hw
Shout to Jump :: A platformer where the character jumps when you shout into the mic. :: hw
Face Dodge :: Dodge falling objects by moving your head in front of the webcam. :: hw
`),
  },
  {
    key: "ai",
    name: "AI Weirdness",
    emoji: "🤖",
    color: "#9561e2",
    ideas: lines(`
Argue With Past You :: Debate an AI trained on your old posts and see who wins. :: ai db
Historical Group Chat :: Napoleon, Cleopatra and Tesla in one group chat, arguing about your problem. :: ai
Raise Rehearsal :: Practice asking for a raise against an AI boss with realistic pushback. :: ai
Voice Memo to Blog :: Ramble into your phone and get a polished blog post. :: ai hw
Wardrobe Stylist :: Photograph your clothes once and get outfits for every occasion. :: ai hw
ELI5 Slider :: Explain anything with a slider from five-year-old to PhD. :: ai
Thumbnail Predictor :: Upload two thumbnails and get a prediction of which gets more clicks. :: ai
PDF to Podcast :: Any PDF becomes a two-host podcast episode. :: ai
Emotional Support Toaster :: An AI toaster that believes in you. Deeply. :: ai
AI Roast Battle :: Roast the AI and it roasts you back. Audience votes. :: ai db
Bedtime Story Hero :: Personalized bedtime stories where your kid is the hero. :: ai
Nagging Meeting Notes :: Meeting notes that assign action items and follow up until they are done. :: ai db
Leaf Doctor :: Photograph a sick leaf and get a diagnosis and treatment. :: ai hw
Napkin to Website :: Draw a site on a napkin, snap it, and get working HTML. :: ai hw
Budget Travel Planner :: A trip planner that respects your real budget down to the coffee. :: ai
Song of Your Day :: Describe your day and get a song about it. :: ai
Debate Judge :: Two people argue, the AI scores logic and evidence. :: ai hw
Tone Slider :: Rewrite any email on a slider from CEO to golden retriever. :: ai
Mistake-Remembering Tutor :: A language partner that remembers your mistakes and drills them. :: ai db
Coloring Page Maker :: Turn any photo into a printable coloring book page. :: ai
Talking Houseplants :: Your plants tell you how they feel based on care logs. :: ai
Clone Support Desk :: An AI support agent trained on your own past replies. :: ai db
Movie Night Negotiator :: Everyone lists preferences and the AI finds the one film nobody hates. :: ai
Week as a Comic :: Your calendar and notes become a four-panel comic. :: ai
Catch Me Up :: Summarizes the group chat you muted for a week. :: ai db
Reverse Interview :: The AI helps you interrogate a company before you accept the job. :: ai
Second Brain Chat :: Chat with your own notes and get sources for every answer. :: ai db
Gift Oracle :: Describe the person and get gift ideas they will actually love. :: ai
Soreness-Aware Coach :: A workout coach that adapts to how sore you are today. :: ai
Dating Profile Honesty Check :: Rates how your dating profile comes across and why. :: ai
Tabletop Game Master :: An AI game master for tabletop campaigns with maps and NPCs. :: ai
Company Slack Poet :: A poet laureate that writes an ode for every shipped feature. :: ai db
Food Label Decoder :: Photograph an ingredient list and learn what everything is. :: ai hw
Filler Word Coach :: Rehearse a speech and count every um, like and basically. :: ai hw
Meme Explainer for Parents :: Explains memes to your parents without making it worse. :: ai
Public Domain Book Chat :: Ask questions to any public-domain book, answered in its voice. :: ai
Handwriting to Font :: Write the alphabet on paper and get your own font file. :: ai hw
Improv Partner :: A yes-and improv partner for practicing comedy and creativity. :: ai
Morning AI Newspaper :: A one-page newspaper about only the things you care about. :: ai db
Spot the Difference AI :: Upload two photos and see exactly what changed. :: ai
Roommate Mediator :: A neutral AI mediator for dishes, noise and rent disputes. :: ai
Startup Name Forge :: Startup names with instant domain availability. :: ai
Time Capsule Letter :: Write to future you and the AI adds predictions to check later. :: ai db
Fridge Photo Chef :: Photograph your fridge and get three recipes you can make now. :: ai hw
Codebase Chat :: Ask any repo how it works and get answers with file links. :: ai
Dream Journal Artist :: Record a dream and get an interpretation plus a painting of it. :: ai hw
Pet Name Consultant :: A very serious consultant for naming your new pet. :: ai
Negotiation Dojo :: Practice buying a car against a stubborn AI salesperson. :: ai
Accent Coach :: Record a sentence and get feedback on pronunciation. :: ai hw
Alt Text Machine :: Bulk-generate alt text for every image on a website. :: ai
Offline Doodle Guesser :: A small model running in your browser guesses what you are drawing as you draw it.
Private Photo Tagger :: Drop in a folder of photos and an in-browser model tags them by subject, fully offline.
Markov Lyric Machine :: A tiny Markov chain trained in your browser writes lyrics in the style of any text you paste.
Pocket Chatbot :: A small language model that downloads once and then chats with you fully offline.
Offline Background Remover :: Remove photo backgrounds with a model that runs entirely in your browser tab.
AI Headshot Studio :: Upload ten selfies and get professional headshots for a one-time fee. :: ai pay
Storybook Hardcover :: Your kid's AI bedtime story, illustrated and printed as a real hardcover book. :: ai pay
Wedding Toast Writer :: Answer questions about the couple and buy a polished, personal toast for nine dollars. :: ai pay
Renaissance Pet Portrait :: Upload your pet and order it painted as a Renaissance noble on real canvas. :: ai pay
Birthday Song Gift :: Describe a friend and buy an AI-made birthday song about them. :: ai pay
`),
  },
  {
    key: "life",
    name: "Everyday Life",
    emoji: "🏡",
    color: "#38c172",
    ideas: lines(`
Receipt Splitter :: Photograph the receipt, tap who had what, and everyone gets a payment link. :: ai hw pay
Plant Watering Buddy :: Watering reminders tuned to each plant's species and season.
Warranty Vault :: Photograph receipts and warranties and get reminded before they expire. :: db hw
Meal Plan to Grocery List :: Pick meals for the week and get a grocery list sorted by aisle.
Roommate Chores :: A fair chore rotation with gentle nudges and zero drama. :: db
One-Button Habit :: A habit tracker with exactly one button per habit.
Where Did I Park :: Saves your parking spot and meter time with one tap. :: hw
Birthday Budgeter :: Birthday reminders with a gift budget and idea list per person.
Smart Packing List :: A packing list from your destination, weather and trip length.
Home Inventory :: Video-walk your home and get an inventory for insurance. :: ai hw
Screen Time Bank :: Kids earn screen time by finishing chores. :: db
Car Care Log :: Tracks oil changes, tires and inspections with reminders.
Recipe Scaler :: Scale any recipe up or down with sensible unit conversion.
Pantry Expiry Radar :: Know what is about to expire before it does.
Moving Day Checklist :: A timeline for moving house, from boxes to address changes.
Kitchen Family Calendar :: A shared family calendar designed for an old tablet on the fridge. :: db
Laundry Symbol Decoder :: Photograph a clothing tag and learn how to wash it. :: ai hw
Did Anyone Feed the Cat :: A shared pet feeding log for the whole household. :: db
Sleep Debt Tracker :: Shows how much sleep you owe and how to pay it back.
Emergency Info Card :: One page with family medical info and contacts for emergencies.
Weighted Decision Maker :: Pros and cons with weights, and a clear answer at the end.
Medicine Cabinet Check :: Tracks expiry dates of everything in the medicine cabinet.
Guest Wi-Fi QR :: Print a pretty QR code guests scan to join your Wi-Fi.
Neighborhood Lost and Found :: Post and find lost keys, pets and gloves near you. :: db
Garage Sale Map :: A map of garage sales this weekend with item previews. :: db
Universal Registry :: A gift registry for anything: babies, moves, graduations. :: db
Bike Today :: Tells you whether today is a good day to bike to work.
Envelope Budget :: The cash envelope method, digital and dead simple.
Home Energy Dashboard :: Understand where your home energy goes month by month. :: db
Library Due Dates :: Tracks library loans for the whole family.
Aisle-Sorted Shopping :: A shopping list that sorts itself by your store's layout.
Babysitter Sheet :: Generates a clear info sheet for babysitters in two minutes.
Dinner Roulette :: Cannot decide what to eat? Spin for dinner.
Reading Streaks :: A book tracker with streaks, quotes and yearly stats.
One Question Journal :: A journal that asks one good question per day.
Room-by-Room Cleaning :: A cleaning schedule that rotates rooms so nothing piles up.
Group Trip Expenses :: Split expenses on a group trip and settle up with minimal transfers. :: db
Cheap Gas Nearby :: The cheapest fuel near you with price history. :: db hw
DIY Project Planner :: Plan a DIY project with a materials list and cost estimate.
School Run Carpool :: Coordinate school pickups between parents with a shared schedule. :: db
Coffee Brew Timer :: Brew timers with recipes for pour-over, AeroPress and French press.
Houseguest Guide :: A welcome page for guests with keys, Wi-Fi, rules and local tips. :: db
Rainy Weekend Planner :: Weekend ideas based on the weather forecast and your city. :: ai
Duplicate Photo Sweeper :: Finds duplicate and blurry photos to free up space.
Voice Grocery List :: Say what you need and it lands on the shared list. :: db hw
Tipping Abroad :: How much to tip in any country, with local etiquette.
Leftover Tracker :: Logs leftovers in the fridge so nothing becomes a science project.
Morning Dashboard :: Weather, transit and calendar on one glanceable screen.
Bill Due Calendar :: All your bills on one calendar with reminders before each due date.
Appliance Manual Finder :: Photograph an appliance and get its manual and common fixes. :: ai hw
Chore Allowance Wallet :: Kids get their allowance paid out when a parent approves the finished chores. :: db pay
Split the Subscription :: Share a family streaming plan and everyone pays their share automatically each month. :: db pay
Neighbor Errand Board :: Post small paid errands like a grocery pickup and a neighbor does them. :: db pay
Babysitter Pay Tracker :: Log babysitting hours and pay the sitter in one tap at the end of the night. :: db pay
`),
  },
  {
    key: "art",
    name: "Creative & Art",
    emoji: "🎨",
    color: "#f66d9b",
    ideas: lines(`
One-Word Poster :: Type a single word and get a generative art poster.
Infinite Shared Canvas :: A collaborative canvas that never ends, where everyone draws together. :: db
Lyric Visualizer :: Animated typography videos for song lyrics.
Animated Pixel Studio :: A pixel art editor with onion skinning and GIF export.
Fridge Poetry Magnets :: Multiplayer virtual fridge poetry magnets. :: db
Photo Mosaic Maker :: Rebuild a photo from hundreds of your other photos.
Draw to Hear :: Draw lines and shapes that play music as they are traced.
Font Pairing Playground :: Try heading and body font pairs on real layouts.
Name Wallpaper :: Generative wallpapers seeded from your name.
Story Dice :: Roll dice with pictures and write a story from them.
Painting Palettes :: The color palettes of famous paintings, ready to copy.
Browser Beat Maker :: A step sequencer with drum kits right in the browser.
Comic Panel Builder :: Lay out comic panels and speech bubbles fast.
Daily Doodle Prompt :: One drawing prompt per day and a gallery of everyone's answers. :: db
Typewriter Mode :: A writing app where you cannot delete. Only forward.
ASCII Camera :: Your webcam, rendered live in ASCII art. :: hw
Album Cover Generator :: Invent an album cover for a band that does not exist. :: ai
One Sentence Story :: A collaborative story where everyone adds one sentence. :: db
Kaleidoscope Webcam :: Turn your webcam into a mesmerizing kaleidoscope. :: hw
Spirograph Studio :: Digital spirograph with gears, colors and SVG export.
Handwriting Animator :: Animate your handwriting as if it were being written live.
Zine Maker :: Design an eight-page zine that prints and folds from one sheet.
Music Moodboard :: A moodboard of songs, colors and images for a project.
Tattoo Sketcher :: Describe an idea and get tattoo sketches in different styles. :: ai
Photo to Poem :: Upload a photo and get a poem about it. :: ai
Stop Motion Studio :: Make stop motion animations with your webcam. :: hw
L-System Garden :: Grow generative plants from simple rules.
Retro Photo Booth :: A photo booth with film filters and printable strips. :: hw
Screenplay Formatter :: Write screenplays with correct formatting automatically.
Knitting Pattern Designer :: Design knitting charts and export patterns.
Rhyme Finder :: A rhyming dictionary tuned for lyrics and rap.
Paint by Numbers :: Turn any photo into a paint-by-numbers template.
Glitch Art Generator :: Glitch images with sliders for datamosh, pixel sort and noise.
City Map Poster :: Beautiful minimalist map posters of any city.
Worldbuilding Wiki :: A wiki for fiction writers with maps, timelines and characters. :: db
Voice Loop Station :: Layer loops of your voice into a song. :: hw
Friend Constellations :: Turn your friends' names into star constellations.
Isometric Room Designer :: Design cozy isometric rooms and share them.
Focus Music Generator :: Endless generative music tuned for focus.
Film Grain Editor :: Add authentic film grain and light leaks to photos.
Book Cover Mockups :: Put your book cover on realistic 3D mockups.
Character Name Generator :: Names for characters by era, region and personality.
Doodle to Animation :: Animate a doodle with simple motion paths.
Visual Tuner :: A musical instrument tuner with beautiful visuals. :: hw
Photo Palette Extractor :: Pull the five key colors from any photo.
Year Wrapped Poster :: A wrapped-style poster from any stats you upload.
Graffiti Wall :: A shared digital wall for spray-paint art. :: db
Weekly Micro-Fiction :: A weekly fifty-word story contest with voting. :: db
Generative Rug Designer :: Design rugs with generative patterns and export for weaving.
Shadow Puppet Theater :: Make shadow puppet shows with your hands on webcam. :: hw
Style Swap Sketch :: Sketch something and an AI redraws it in the style of a famous art movement. :: ai
Poem Illustrator :: Paste a poem and get an illustration for each stanza. :: ai
Commission Queue :: Artists open commission slots, take deposits and show buyers where they are in line. :: db pay
Print Shop in a Link :: Sell prints of your art through print-on-demand with zero inventory. :: db pay
Brush Pack Market :: Digital artists sell brush and texture packs with instant downloads. :: db pay
Pay-What-You-Want Zine :: Publish a digital zine that readers unlock with any payment. :: pay
Live Drawing Tip Jar :: Stream your canvas while you draw and viewers tip to pick the next color. :: db pay
`),
  },
];

// Jackpot pool: 25 legendary ideas, bigger and bolder. A spin hits one 1 time in 40.
// Same "Title :: pitch" format, never tagged: the stack filter does not apply to jackpots.
export const JACKPOTS: string[] = lines(`
Personal Time Machine :: Every photo, message and calendar entry you ever made becomes one searchable life you can replay day by day.
City Twin :: A live 3D model of your city fed by open data. Buses move, trees bloom, and anyone can propose a change and see its effect.
Babel Call :: Phone calls where each person hears the other in their own language, in the speaker's own voice, with under a second of delay.
Open Hardware Store :: Every product ships with its CAD files and repair guides, and a community that improves the next version.
Robot-Ready Recipes :: A cooking app that writes recipes as step-by-step programs a cheap robot arm can actually follow.
The Last Spreadsheet :: Describe any business process in plain words and get a living app with forms, roles, reports and an audit trail.
Neighborhood Power Grid :: Households with solar trade spare electricity with neighbors in real time, settled every fifteen minutes.
Lifelong Tutor :: One AI tutor that follows a person from age six to sixty and remembers every concept they ever struggled with.
Crowd Science Lab :: Millions of phones become one sensor network measuring earthquakes, air quality and light pollution.
Film From Your Script :: Paste a short screenplay and get a storyboarded animatic with temp voices and music, ready to pitch.
Honest Marketplace :: A second-hand marketplace where every item carries its full repair history and a verified condition score.
Game That Builds Itself :: A multiplayer world where players propose new rules in plain words and the game rewrites itself overnight.
Universal Inbox Zero :: One inbox for email, texts, Slack and DMs that answers the routine messages itself and asks you about the rest.
Micro-Factory Network :: Local 3D-print and CNC shops form one network. Upload a design and the nearest idle machine makes it.
Dream Home Walkthrough :: Sketch a floor plan on paper and walk through it in VR with real furniture and daylight for any season.
Memory Palace Builder :: Turns anything you need to learn into a 3D palace you walk through, with spaced repetition built in.
Citizen Budget :: Every resident plays their city budget as a game, moves money between services, and the council sees the average.
Recipe Genome :: A family tree of every recipe on Earth by ingredient and technique, so you can trace any dish back to its ancestors.
Accessibility Autopilot :: A browser layer that repairs any website on the fly for screen readers, dyslexia, low vision and tremors.
Studio in a Tab :: A full collaborative music studio in the browser where bandmates on four continents record in sync.
The Everything Tracker :: Point a camera at anything in your home and it knows what it is, where it lives and when it needs replacing.
Worldwide Game Night :: A weekly live game show where a million players answer at once and the last one standing wins a real prize.
Local News Revival :: A newsroom kit that lets one person run a real local paper covering council meetings, courts and schools.
Digital Heirloom Vault :: Family recipes, voices and stories preserved and unlocked by grandchildren on birthdays you choose.
Build-It-For-Me Button :: Describe an app in one sentence and watch it get specced, built, tested and deployed while you make coffee.
`);

// Twists stack onto any idea for an extra dose of chaos. 400 ideas x 40 twists.
export const TWISTS: string[] = lines(`
...but it must work fully offline.
...but the entire UI is a chat conversation.
...but it is designed for dogs.
...but for people over 80.
...but it only works between 11pm and 1am.
...but everything is voice-controlled.
...but in the style of a 90s website.
...but it runs entirely in the terminal.
...but multiplayer, in real time.
...but each user gets exactly one action per day.
...but the whole app fits in one screen with no scrolling.
...but as a browser extension.
...but it speaks only in pirate.
...but everything costs one cent.
...but it is a physical-world scavenger hunt.
...but it has a villain narrator.
...but built for kids aged 6 to 10.
...but it must be usable with one thumb.
...but every action plays a sound effect.
...but powered only by SMS.
...but for a specific city you love.
...but with a leaderboard.
...but it runs on a smartwatch.
...but it is a Slack or Discord bot.
...but everything is anonymous.
...but it is dark mode only and very moody.
...but the AI is way too enthusiastic.
...but no text allowed, only icons.
...but it has to be under 100 lines of code.
...but it is a daily ritual that takes 30 seconds.
...but it turns everything into a game show.
...but for astronauts on a long mission.
...but with a Nordic minimalist design.
...but it is open source and self-hostable.
...but it gives away a real prize once a week.
...but it is for a team of exactly two people.
...but it prints something on paper.
...but made for a medieval kingdom.
...but everything is shaped like a cat.
...but it must launch today.
`);

export const TAGS = ["ai", "db", "pay", "hw"];

// The stack filter chips. Selected chips combine with OR; categories combine with AND.
export const STACKS: { key: string; label: string; match: (tags: string[]) => boolean }[] = [
  { key: "none", label: "🧩 No backend", match: (t) => t.length === 0 },
  { key: "ai", label: "✨ Uses AI", match: (t) => t.includes("ai") },
  { key: "pay", label: "💳 Takes payments", match: (t) => t.includes("pay") },
  { key: "hw", label: "📷 Uses device hardware", match: (t) => t.includes("hw") },
];

// cat is an index into CATEGORIES, or JACKPOT for the legendary pool.
export type Pick = { cat: number; idx: number; twist: number | null };
export const JACKPOT = 99;
const JACKPOT_CAT: Category = { key: "jackpot", name: "Jackpot", emoji: "👑", color: "#c9971c", ideas: JACKPOTS };
export const catOf = (cat: number): Category | undefined => (cat === JACKPOT ? JACKPOT_CAT : CATEGORIES[cat]);

export const parseIdea = (raw: string) => {
  const [title, pitch, tags = ""] = raw.split(" :: ");
  return { title, pitch, tags: tags.split(" ").filter(Boolean) };
};

// Undefined when a pick points outside the bank (stale history, hand-edited links).
export const ideaOf = (p: Pick) => {
  const c = catOf(p.cat);
  const raw = c?.ideas[p.idx];
  if (!c || raw === undefined) return undefined;
  if (p.twist !== null && !(Number.isInteger(p.twist) && p.twist >= 0 && p.twist < TWISTS.length)) return undefined;
  return { ...parseIdea(raw), cat: c };
};

// Stable idea id, e.g. "money-12" or "jackpot-3".
export const ideaId = (p: Pick) => `${catOf(p.cat)!.key}-${p.idx}`;
export const pickFromId = (key: string, idx: number, twist: number | null): Pick | null => {
  const p = { cat: key === JACKPOT_CAT.key ? JACKPOT : CATEGORIES.findIndex((c) => c.key === key), idx, twist };
  return ideaOf(p) ? p : null;
};

// The pick for a real idea's id written the canonical way, else null, so "money-012" can
// never become a second vote key for "money-12". The API validates every id with this.
export const pickOfId = (id: unknown): Pick | null => {
  if (typeof id !== "string" || id.length > 40) return null;
  const m = /^([a-z]+)-(\d+)$/.exec(id);
  const p = m && pickFromId(m[1], Number(m[2]), null);
  return p && ideaId(p) === id ? p : null;
};
export const isIdeaId = (id: unknown): id is string => pickOfId(id) !== null;

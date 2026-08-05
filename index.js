require('dotenv').config();

const {
    Client,
    GatewayIntentBits
} = require('discord.js');

const {
    loadCommands
} = require('./src/handlers/commandHandler');


// ======================================================
// BUAT CLIENT DISCORD
// ======================================================

const client =

    new Client({

        intents: [

            GatewayIntentBits.Guilds,

            GatewayIntentBits.GuildMessages,

            GatewayIntentBits.MessageContent

        ]

    });


// ======================================================
// LOAD SEMUA COMMAND
// ======================================================

loadCommands(

    client

);


// ======================================================
// LOAD EVENT MESSAGE CREATE
// ======================================================

const messageCreate =

    require(

        './src/events/messageCreate'

    );


client.on(

    'messageCreate',

    async (message) => {

        await messageCreate.execute(

            message

        );

    }

);


// ======================================================
// LOAD EVENT CLIENT READY
// ======================================================

const clientReady =

    require(

        './src/events/clientReady'

    );


// ======================================================
// JALANKAN EVENT CLIENT READY
// ======================================================

client.once(

    'clientReady',

    async () => {

        await clientReady.execute(

            client

        );

    }

);


// ======================================================
// LOGIN BOT
// ======================================================

client.login(

    process.env.DISCORD_TOKEN

);
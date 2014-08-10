var game = new Phaser.Game(600, 500, Phaser.AUTO, 'game_div');
var game_state = {};
var music;
var musicIsPlaying = false;

game_state.main = function() { };  
game_state.main.prototype = {

    preload: function() { 
        this.game.stage.backgroundColor = '#71c5cf';

        // Load the doge sprite
        this.game.load.image('doge', 'assets/doge.png');  

        // Load the pipe sprite
        this.game.load.image('pipe', 'assets/pipe.png');      
		
		this.game.load.audio('dogeSong', ['audio/doge.mp3']);
    },
    create: function() { 
		music = game.add.audio('dogeSong', 1, true);
		if (!musicIsPlaying)
		{
			music.play('',0,1,true);
			musicIsPlaying = true;
		}
        this.doge = this.game.add.sprite(100, 245, 'doge');
        this.doge.body.gravity.y = 1000; 

        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this);
        game.input.onDown.add(this.jump, this);

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');  

        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);           
			
        this.score = 0;
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style);  
    },

    update: function() {
        if (this.doge.inWorld == false)
            this.restart_game(); 

        this.game.physics.overlap(this.doge, this.pipes, this.restart_game, null, this);      
    },

    jump: function() {
        this.doge.body.velocity.y = -350;
    },

    restart_game: function() {
		if (this.score > $("#highestScore").text())
		{
			$("#highestScore").text(this.score);
		}
        this.game.time.events.remove(this.timer);
        this.game.state.start('main');
    },

    add_one_pipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
		if (pipe != null)
		{
			pipe.reset(x, y);
			pipe.body.velocity.x = -200; 
			pipe.outOfBoundsKill = true;
		}
    },

    add_row_of_pipes: function() {
        var hole = Math.floor(Math.random()*6)+1;
        
		for (var i = 0; i < 10; i++)
			if (i != hole && i != hole +1) 
				this.add_one_pipe(600, i*50);   
		
		this.score += 1;
		this.label_score.content = this.score;  
    },
};

game.state.add('main', game_state.main);  
game.state.start('main'); 
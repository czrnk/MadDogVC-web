var AnimatedCloudLayer = function(config){
    this.config = {
        elid: "",
        images: [],
        particles: [],
        fps: 20,
        num_clouds: 10,
        height: 300
    }
    var self = this;
    this.setConfig = function(config){
        $.extend(this.config, config);
    }
    this.init = function(config){
        this.setConfig(config);
        this.config.canvas = document.createElement( 'canvas' );
        this.config.canvas.width = window.innerWidth;
        // For full page
        // this.config.canvas.height = window.innerHeight;
        this.config.canvas.height = this.config.height;

        this.config.context = this.config.canvas.getContext( '2d' );
        this.config.context.setTransform( 1, 0, 0, 1, this.config.canvas.width / 2, this.config.canvas.height / 2 );

        document.getElementById(this.config.elid).appendChild( this.config.canvas );

        for ( var i = 0, il = this.config.num_clouds; i < il; i ++ ) {
            this.config.particles.push( this.cloud() );
        }
        this.startAnimating(self.config.fps);
    }
    this.cloud = function() {
        var cloudsprite = document.createElement( 'img' );
        var rand = Math.floor(Math.random()*self.config.images.length)
        cloudsprite.src = self.config.images[rand];
        
        var newCloud = {
            x: 0,
            y: Math.floor(Math.random() * (self.config.canvas.height + 1)) - self.config.canvas.height/2,
            z: Math.floor(Math.random() * (5-0+1)),
            rotation: Math.random() * Math.PI,
            scale: Math.random() * 4 + 2,
            sprite: cloudsprite
          }

        var imgwidth = Math.ceil(newCloud.scale)*newCloud.sprite.width;

        var zero = (self.config.canvas.width/2 * -1)-imgwidth;
        var min = zero-imgwidth;

        newCloud.x = Math.floor(Math.random() * (zero - min + 1)) + min

        return newCloud;
    }
    this.startAnimating = function() {
      self.config.fpsInterval = 1000 / self.config.fps;
      self.config.then = Date.now();
      self.animate();
    }
    this.animate = function() {
        requestAnimationFrame( self.animate )
        now = Date.now();
        elapsed = now - self.config.then;

        // if enough time has elapsed, draw the next frame
        if (elapsed > self.config.fpsInterval) {
            // Get ready for next frame by setting then=now, but...
            // Also, adjust for fpsInterval not being multiple of 16.67
            self.config.then = now - (elapsed % self.config.fpsInterval);
            // draw stuff here
            self.render();
        }
    }
    this.render = function() {
        self.config.context.clearRect( - self.config.canvas.width / 2, - self.config.canvas.height / 2, self.config.canvas.width, self.config.canvas.height );
        self.config.particles.sort( function ( a, b ) { return b.x > a.x } );
        for ( var i = 0, il = self.config.particles.length; i < il; i ++ ) {
          var particle = self.config.particles[ i ];

          var max = self.config.canvas.width/2;
          var imgwidth = Math.ceil(particle.scale)*particle.sprite.width;
          if(particle.x > (max+imgwidth)){
              self.config.particles[i] = self.cloud();
          } else {
            particle.x += 10;
            self.config.context.save();
            self.config.context.translate( particle.x, particle.y );
            self.config.context.rotate( particle.rotation );
            self.config.context.scale( particle.scale, particle.scale );
            self.config.context.drawImage( particle.sprite, 0, 0 );
            self.config.context.restore();
          }
        }
    }
    this.init(config);
    return this;
}
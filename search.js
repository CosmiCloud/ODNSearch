const prompts = require('prompts');
const util = require('util');

const exec = util.promisify(require('child_process').exec);
const DKGClient = require('dkg-client');

const OT_NODE_HOSTNAME = '0.0.0.0';
const OT_NODE_PORT = '8900';

module.exports ={
  search: async function search(){
  try{
    (async () => {
	  // initialize connection to your DKG Node
      let options = { endpoint: OT_NODE_HOSTNAME, port: OT_NODE_PORT, useSSL: false, loglevel: 'info' };
      const dkg = new DKGClient(options);
	  
      var response = await prompts({
        type: 'text',
        name: 'response',
        message: '\x1b[35mWhat would you like to search the ODN for?'
      });

      if(response.response){
        var search_term = response.response

        console.log('\x1b[35mEntities -   [1]')
        console.log('\x1b[35mAssertions - [2]')
		console.log(' ')
        var response = await prompts({
          type: 'text',
          name: 'response',
          message: '\x1b[35mEntities or Assertions?'
        });

        if(response.response == '1'){
          type = 'entities'
        }else if(response.response == '2'){
          type = 'assertions'
        }else{
          console.log('\x1b[35mInvalid response, try it again from the top!')
          module.exports.search();
        }

        console.log('\x1b[35mSearching the ODN for \x1b[32m'+type+' \x1b[35mthat match: \x1b[32m'+search_term+'\x1b[35m.')
        options = { query: search_term, resultType: type };

		dkg.search(options).then((result) => {
			if(result.status == 'FAILED'){
            console.log('\x1b[31mSearch Failed!')
            console.log('\x1b[35m',result.error)
            return;
			}
			console.log('\x1b[32mSearch Completed!')
			console.log(' ')
			console.log('\x1b[35mHeres a string of the result data!')
            console.log('\x1b[32m',JSON.stringify(result));
            console.log(' ')
            console.log('\x1b[35mCheck out your node logs to see your node working!')
			});
      }else{
        console.log('\x1b[35mSearch something for real next time.');
        return;
      }
        })();
      }catch(e){
        console.log('\x1b[31m',e);
      }
  }
}
module.exports.search();

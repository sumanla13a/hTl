'use strict';
function Response(success, data) {
	if(success) {
		return {
			success: success,
			data: data
		};
	} else {
		return {
			success: 0,
			error: data.message
		};
	}
}

module.exports = Response;
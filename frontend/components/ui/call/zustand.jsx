import { create } from 'zustand';

export const useVideoCall = create((set) => ({
	callVideoStreams: {},
	myPeer: null,
	micEnabled: true,
	videoEnabled: true,
	showCallScreen: false,
	room: null,
	stream: null,
	inCall: false,
	sockCli: null,
	setMyPeer: (peer) => set({ myPeer: peer }),
	setShowCallScreen: (show) => set({ showCallScreen: show }),
	setCallVideoStreams: (streams) => set({ callVideoStreams: streams }),
	addCallVideoStream: (userId, stream) => set((state) => ({ callVideoStreams: { ...state.callVideoStreams, [userId]: stream } })),
	removeCallVideoStream: (userId) => set((state) =>
	{
		const { [userId]: _, ...rest } = state.callVideoStreams;
		return { callVideoStreams: rest };
	}),
	toggleAudio: () => set((state) => ({ micEnabled: !state.micEnabled })),
	toggleVideo: () => set((state) => ({ videoEnabled: !state.videoEnabled })),
	setRoom: (room) => set({ room: room }),
	leaveCallFunc: () => set((state) =>
	{
		state.setShowCallScreen(false);
		if (state.myPeer)
			state.myPeer.destroy();

		if (state.stream)
			state.stream.getTracks().forEach(track => track.stop());

		return {
			myPeer: null,
			callVideoStreams: {},
			sockCli: state.sockCli, // retain sockCli
			stream: state.stream, // retain stream
			inCall: false,
			micEnabled: true, // reset micEnabled
			videoEnabled: true, // reset videoEnabled
			room: null // reset room
		};
	}),
	setStream: (stream) => set({ stream: stream }),
	setInCall: (inCall) => set({ inCall: inCall }),
	setSockCli: (sockCli) => set({ sockCli: sockCli }),
}));
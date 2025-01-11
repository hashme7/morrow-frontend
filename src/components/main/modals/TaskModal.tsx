// // src/components/TaskModal.tsx
// import React, { useState } from 'react';
// import { useAppDispatch } from '../../../store/hooks/hooks';
// import { createTask } from '../../../store/slices/BoardSlice';

// interface TaskModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose }) => {
//   const dispatch = useAppDispatch();
//   const [name, setName] = useState('');
//   const [description, setDescription] = useState('');
//   const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
//   const [plannedStartDate, setPlannedStartDate] = useState('');
//   const [plannedEndDate, setPlannedEndDate] = useState('');

//   const handleCreateTask = () => {
//     dispatch(createTask({ name,description, plannedStartDate, plannedEndDate, priority }));
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <div className="bg-white rounded-lg p-6 w-96">
//         <h2 className="text-lg font-semibold mb-4">Create Task</h2>
//         <input type="text" placeholder="Task Name" value={name} onChange={(e) => setName(e.target.value)} className="mb-3 w-full border p-2 rounded" />
//         <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="mb-3 w-full border p-2 rounded" />
//         <input type="date" value={plannedStartDate} onChange={(e) => setPlannedStartDate(e.target.value)} className="mb-3 w-full border p-2 rounded" />
//         <input type="date" value={plannedEndDate} onChange={(e) => setPlannedEndDate(e.target.value)} className="mb-3 w-full border p-2 rounded" />
//         <select value={priority} onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')} className="mb-3 w-full border p-2 rounded">
//           <option>Low</option>
//           <option>Medium</option>
//           <option>High</option>
//         </select>
//         <button onClick={handleCreateTask} className="bg-blue-500 text-white p-2 rounded">Create Task</button>
//         <button onClick={onClose} className="ml-2 text-red-500">Cancel</button>
//       </div>
//     </div>
//   );
// };

// export default TaskModal;

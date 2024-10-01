import { useEffect, useState, useMemo } from "react";
import { Box, Modal, Button, Typography, Stack, TextField, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { Plan } from "../section/MainContent";

export interface User {
    firstname: string;
    lastname: string;
    age: number | '';
    gender: 'male' | 'female' | 'not_specified' | '';
    telno?: string;
    email?: string;
    address?: string;
}

const style = {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 600,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
}

interface UserInfoModalProps {
    isOpen: boolean;
    onClose: () => void;
    plan: Plan;
    registerPlanToDB: (plan: Plan) => void;
    onUserRegistered: (plan: Plan) => void;
}

const initialUserData: User = {
    firstname: '',
    lastname: '',
    age: '',
    gender: '',
    telno: '',
    email: '',
    address: '',
};

export function UserInfoModal({ isOpen, onClose, plan, registerPlanToDB, onUserRegistered }: UserInfoModalProps) {
    const [users, setUsers] = useState<User[]>([]);

    const totalUsers = useMemo(() => 
        (plan.travelBasic?.people.adults ?? 0) + 
        (plan.travelBasic?.people.children ?? 0) + 
        (plan.travelBasic?.people.infants ?? 0),
        [plan.travelBasic?.people.adults, plan.travelBasic?.people.children, plan.travelBasic?.people.infants]
    );

    useEffect(() => {
        setUsers(Array(totalUsers).fill(initialUserData));
    }, [totalUsers]);

    const handleChange = (index: number, field: keyof User, value: string | number) => {
        const updatedUsers = [...users];
        updatedUsers[index] = { ...updatedUsers[index], [field]: value };
        setUsers(updatedUsers);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (users.every((user, index) => 
            user.firstname && user.lastname && user.gender !== '' && user.age !== '' &&
            (index === 0 ? user.telno && user.email && user.address : true))) {
            plan.user = users;

            registerPlanToDB(plan);

            // コールバック関数
            onUserRegistered(plan);
            onClose();
        } else {
            alert('全ての項目を入力してください。');
        }
    }

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" mb={2}>
                    ユーザー情報を入力する
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={4}>
                        {users.map((user, index) => (
                            <Box key={index}>
                                <Typography variant="h6" mb={2}>
                                    {index === 0 ? '代表者' : `同行者 ${index}`}
                                </Typography>
                                <Stack spacing={2}>
                                    <Box display="flex" justifyContent="space-between">
                                        <Box width="48%">
                                            <TextField
                                                label="姓"
                                                value={user.lastname}
                                                onChange={(e) => handleChange(index, 'lastname', e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </Box>
                                        <Box width="48%">
                                            <TextField
                                                label="名"
                                                value={user.firstname}
                                                onChange={(e) => handleChange(index, 'firstname', e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </Box>
                                    </Box>
                                    <Box display="flex" justifyContent="space-between">
                                        <Box width="48%">
                                            <FormControl fullWidth required>
                                                <InputLabel id={`age-select-label-${index}`}>年齢</InputLabel>
                                                <Select
                                                    labelId={`age-select-label-${index}`}
                                                    value={user.age}
                                                    label="年齢"
                                                    onChange={(e) => handleChange(index, 'age', e.target.value as number)}
                                                >
                                                    <MenuItem value="" disabled>選択してください</MenuItem>
                                                    {[...Array(101)].map((_, i) => (
                                                        <MenuItem key={i} value={i}>{i}歳</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box width="48%">
                                            <FormControl fullWidth required>
                                                <InputLabel id={`gender-select-label-${index}`}>性別</InputLabel>
                                                <Select
                                                    labelId={`gender-select-label-${index}`}
                                                    value={user.gender}
                                                    label="性別"
                                                    onChange={(e) => handleChange(index, 'gender', e.target.value as 'male' | 'female' | 'not_specified')}
                                                >
                                                    <MenuItem value="" disabled>選択してください</MenuItem>
                                                    <MenuItem value="male">男性</MenuItem>
                                                    <MenuItem value="female">女性</MenuItem>
                                                    <MenuItem value="not_specified">無回答</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </Box>
                                    {index === 0 && (
                                        <>
                                            <TextField
                                                label="電話番号"
                                                value={user.telno}
                                                onChange={(e) => handleChange(index, 'telno', e.target.value)}
                                                fullWidth
                                                required
                                            />
                                            <TextField
                                                label="メールアドレス"
                                                type="email"
                                                value={user.email}
                                                onChange={(e) => handleChange(index, 'email', e.target.value)}
                                                fullWidth
                                                required
                                            />
                                            <TextField
                                                label="住所"
                                                value={user.address}
                                                onChange={(e) => handleChange(index, 'address', e.target.value)}
                                                fullWidth
                                                required
                                            />
                                        </>
                                    )}
                                </Stack>
                            </Box>
                        ))}
                        <Button type="submit" variant="contained" color="primary">
                            登録
                        </Button>
                        <Button onClick={onClose} sx={{ mt: 2 }}>Close</Button>
                    </Stack>
                </form>
            </Box>
        </Modal>
    )
}
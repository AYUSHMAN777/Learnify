import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Separator } from '@/components/ui/separator';

const Filter = ({ handleFilterChange }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [sortByPrice, setSortByPrice] = useState('');

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prev) => {
            const newCategories = prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId];
            handleFilterChange(newCategories, sortByPrice);
            return newCategories;
        });
    };

    const selectByPriceHandler = (selectedValue) => {
        setSortByPrice(selectedValue);
        handleFilterChange(selectedCategories, selectedValue);
    };

    const categories = [
        { id: "nextjs", label: "Next Js" },
        { id: "data-science", label: "Data Science" },
        { id: "frontend-development", label: "Frontend Development" },
        { id: "fullstack-development", label: "Fullstack Development" },
        { id: "mern-stack-development", label: "MERN Stack Development" },
        { id: "backend-development", label: "Backend Development" },
        { id: "javascript", label: "Javascript" },
        { id: "python", label: "Python" },
        { id: "docker", label: "Docker" },
        { id: "mongodb", label: "MongoDB" },
        { id: "html", label: "HTML" }
    ];

    return (
        <Card className="w-full md:w-80 dark:bg-gray-800 shadow-lg">
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle>Filter Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <div >
                    <Label className="pl-1">Sort By</Label>
                    <Select onValueChange={selectByPriceHandler}>
                        <SelectTrigger className="w-full mt-2">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest</SelectItem>
                            <SelectItem value="price-asc">Price: Low to High</SelectItem>
                            <SelectItem value="price-desc">Price: High to Low</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Separator />
                <div className="space-y-3">
                    <h3 className="font-semibold">Category</h3>
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-3">
                                <Checkbox id={category.id} onCheckedChange={() => handleCategoryChange(category.id)} />
                                <Label htmlFor={category.id} className="text-sm font-medium leading-none cursor-pointer">
                                    {category.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Filter;
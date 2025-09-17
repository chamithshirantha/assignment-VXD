<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Form extends Model
{
    use HasFactory;

    protected $fillable = ['title'];
    public function fields(){ return $this->hasMany(Field::class)->orderBy('order'); }
    public function submissions(){ return $this->hasMany(Submission::class); }
}

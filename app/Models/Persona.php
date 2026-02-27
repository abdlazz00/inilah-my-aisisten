<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasUuids;
    //
    protected $fillable = ['name', 'system_prompt', 'is_active'];

    protected $casts = [
        'is_active' => 'boolean'
    ];
}
